import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from 'app/core/api/api.service';

export interface AddDestinoData {
  nombre: string;
  descripcion?: string;
  razon_social: string;
  codigo_postal?: string;
  calle?: string;
  num_ext?: string;
  num_int?: string;
  colonia?: string;
  delegacion?: string;
  estado?: string;
  telefono?: string;
  correo_electronico?: string;
  autorizacion_semarnat?: string;
  nombre_encargado?: string;
  cargo_encargado?: string;
  observaciones?: string;
}

@Component({
  selector: 'app-add-destino-dialog',
  templateUrl: './add-destino-dialog.component.html',
  styleUrls: ['./add-destino-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule
  ]
})
export class AddDestinoDialogComponent implements OnInit, OnDestroy {
  destinoForm: FormGroup;
  loading = false;
  error = '';

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private dialogRef: MatDialogRef<AddDestinoDialogComponent>,
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) {
    this.destinoForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      descripcion: [''],
      razon_social: ['', [Validators.required, Validators.minLength(2)]],
      codigo_postal: [''],
      calle: [''],
      num_ext: [''],
      num_int: [''],
      colonia: [''],
      delegacion: [''],
      estado: [''],
      telefono: [''],
      correo_electronico: ['', [Validators.email]],
      autorizacion_semarnat: [''],
      nombre_encargado: [''],
      cargo_encargado: [''],
      observaciones: ['']
    });
  }

  ngOnInit(): void {
    // Los iconos ya están registrados globalmente
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  onSubmit(): void {
    if (this.destinoForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const destinoData = this.destinoForm.value;

    this.apiService.post<{success: boolean, message: string, data: any}>('/destinos', destinoData)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.dialogRef.close(true);
          } else {
            this.error = response.message || 'Error al crear el destino';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error creating destino:', error);
          this.error = 'Error de conexión al servidor';
          this.loading = false;
        }
      });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
} 