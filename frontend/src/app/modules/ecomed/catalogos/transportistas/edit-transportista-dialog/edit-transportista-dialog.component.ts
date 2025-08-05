import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'app/core/api/api.service';
import { IconsService } from 'app/core/icons/icons.service';

export interface Transportista {
  id: number;
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
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-edit-transportista-dialog',
  templateUrl: './edit-transportista-dialog.component.html',
  styleUrls: ['./edit-transportista-dialog.component.scss'],
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
export class EditTransportistaDialogComponent implements OnInit {
  transportistaForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private dialogRef: MatDialogRef<EditTransportistaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Transportista,
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

  ngOnInit(): void {
    // Cargar los datos del transportista en el formulario
    this.transportistaForm.patchValue({
      razon_social: this.data.razon_social,
      codigo_postal: this.data.codigo_postal || '',
      calle: this.data.calle || '',
      num_ext: this.data.num_ext || '',
      num_int: this.data.num_int || '',
      colonia: this.data.colonia || '',
      delegacion: this.data.delegacion || '',
      estado: this.data.estado || '',
      telefono: this.data.telefono || '',
      correo_electronico: this.data.correo_electronico || '',
      autorizacion_semarnat: this.data.autorizacion_semarnat || '',
      permiso_sct: this.data.permiso_sct || '',
      tipo_vehiculo: this.data.tipo_vehiculo || '',
      placa: this.data.placa || '',
      ruta_empresa: this.data.ruta_empresa || ''
    });
  }

  onSubmit(): void {
    if (this.transportistaForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const transportistaData = this.transportistaForm.value;

    this.apiService.put<{success: boolean, data: any, message: string}>(`/transportistas/${this.data.id}`, transportistaData)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.dialogRef.close(response.data);
          } else {
            this.error = response.message || 'Error al actualizar el transportista';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating transportista:', error);
          this.error = error.error?.message || 'Error de conexión al servidor';
          this.loading = false;
        }
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 