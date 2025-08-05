import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'app/core/api/api.service';
import { IconsService } from 'app/core/icons/icons.service';

export interface AddTransportistaData {
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
  permiso_sct?: string;
  tipo_vehiculo?: string;
  placa?: string;
  ruta_empresa?: string;
}

@Component({
  selector: 'app-add-transportista-dialog',
  templateUrl: './add-transportista-dialog.component.html',
  styleUrls: ['./add-transportista-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AddTransportistaDialogComponent implements OnInit {
  transportistaForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private dialogRef: MatDialogRef<AddTransportistaDialogComponent>,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private iconsService: IconsService
  ) {
    this.transportistaForm = this.formBuilder.group({
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
      permiso_sct: [''],
      tipo_vehiculo: [''],
      placa: [''],
      ruta_empresa: ['']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.transportistaForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const transportistaData = this.transportistaForm.value;

    this.apiService.post<{success: boolean, data: any, message: string}>('/transportistas', transportistaData)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.dialogRef.close(response.data);
          } else {
            this.error = response.message || 'Error al crear el transportista';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error creating transportista:', error);
          this.error = error.error?.message || 'Error de conexión al servidor';
          this.loading = false;
        }
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 