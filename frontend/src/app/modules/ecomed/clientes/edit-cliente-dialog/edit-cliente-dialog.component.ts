import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from '../../../../core/api/api.service';
import { Cliente } from '../clientes.component';

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
  selector: 'app-edit-cliente-dialog',
  templateUrl: './edit-cliente-dialog.component.html',
  styleUrls: ['./edit-cliente-dialog.component.scss'],
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
export class EditClienteDialogComponent implements OnInit, OnDestroy {
  clienteForm: FormGroup;
  loading = false;
  error = '';
  validationErrors: { [key: string]: string } = {};
  destinos: Destino[] = [];
  transportistas: Transportista[] = [];
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private dialogRef: MatDialogRef<EditClienteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Cliente,
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
    this.initializeForm();
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

  initializeForm(): void {
    this.clienteForm.patchValue({
      numero_registro_ambiental: this.data.numero_registro_ambiental,
      nombre_razon_social: this.data.nombre_razon_social,
      rfc: this.data.rfc || '',
      codigo_postal: this.data.codigo_postal || '',
      calle: this.data.calle || '',
      num_ext: this.data.num_ext || '',
      num_int: this.data.num_int || '',
      colonia: this.data.colonia || '',
      delegacion: this.data.delegacion,
      estado: this.data.estado,
      telefono: this.data.telefono,
      email: this.data.email,
      zona: this.data.zona,
      id_destino: this.data.id_destino,
      id_transportista: this.data.id_transportista
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

    this.apiService.put<{success: boolean, message: string, data: any, errors?: any[]}>(`/clientes/${this.data.id}`, clienteData)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.dialogRef.close(true);
          } else {
            this.error = response.message || 'Error al actualizar el cliente';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating cliente:', error);
          
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