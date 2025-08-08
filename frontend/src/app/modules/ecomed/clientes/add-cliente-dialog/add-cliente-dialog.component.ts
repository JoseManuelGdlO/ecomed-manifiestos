import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from '../../../../core/api/api.service';

export interface AddClienteData {
  numero_registro_ambiental: string;
  nombre_razon_social: string;
  rfc: string;
  codigo_postal: string;
  calle: string;
  num_ext: string;
  num_int: string;
  colonia: string;
  delegacion: string;
  estado: string;
  telefono: string;
  email: string;
  zona: string;
  id_destino: number;
  id_transportista: number;
}

export interface Destino {
  id: number;
  nombre: string;
  razon_social: string;
}

export interface Transportista {
  id: number;
  razon_social: string;
  placa: string;
}

@Component({
  selector: 'app-add-cliente-dialog',
  templateUrl: './add-cliente-dialog.component.html',
  styleUrls: ['./add-cliente-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    ReactiveFormsModule
  ]
})
export class AddClienteDialogComponent implements OnInit, OnDestroy {
  clienteForm: FormGroup;
  loading = false;
  error = '';
  validationErrors: { [key: string]: string } = {};
  destinos: Destino[] = [];
  transportistas: Transportista[] = [];
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private dialogRef: MatDialogRef<AddClienteDialogComponent>,
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) {
    this.clienteForm = this.formBuilder.group({
      numero_registro_ambiental: ['', [Validators.required, Validators.minLength(3)]],
      nombre_razon_social: ['', [Validators.required, Validators.minLength(3)]],
      rfc: ['', [Validators.minLength(10), Validators.maxLength(13)]],
      codigo_postal: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
      calle: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      num_ext: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      num_int: ['', [Validators.maxLength(20)]],
      colonia: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      delegacion: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern(/^[\d\s\-\+\(\)]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      zona: ['', [Validators.required]],
      id_destino: ['', [Validators.required]],
      id_transportista: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadDestinos();
    this.loadTransportistas();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  loadDestinos(): void {
    this.apiService.get<{success: boolean, data: Destino[]}>('/destinos')
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.destinos = response.data;
          }
        },
        error: (error) => {
          console.error('Error loading destinos:', error);
        }
      });
  }

  loadTransportistas(): void {
    this.apiService.get<{success: boolean, data: Transportista[]}>('/transportistas')
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.transportistas = response.data;
          }
        },
        error: (error) => {
          console.error('Error loading transportistas:', error);
        }
      });
  }

  onSubmit(): void {
    if (this.clienteForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.validationErrors = {};

    const clienteData = this.clienteForm.value;

    this.apiService.post<{success: boolean, message: string, data: any, errors?: any[]}>('/clientes', clienteData)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.dialogRef.close(true);
          } else {
            this.error = response.message || 'Error al crear el cliente';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error creating cliente:', error);
          
          // Handle validation errors
          if (error.error && error.error.errors && Array.isArray(error.error.errors)) {
            this.validationErrors = {};
            error.error.errors.forEach((err: any) => {
              this.validationErrors[err.path] = err.msg;
            });
            this.error = 'Por favor, corrija los errores de validación';
          } else {
            this.error = error.error?.message || 'Error de conexión al servidor';
          }
          
          this.loading = false;
        }
      });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
} 