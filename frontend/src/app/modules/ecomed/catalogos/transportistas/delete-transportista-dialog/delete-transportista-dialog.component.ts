import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
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
  selector: 'app-delete-transportista-dialog',
  templateUrl: './delete-transportista-dialog.component.html',
  styleUrls: ['./delete-transportista-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ]
})
export class DeleteTransportistaDialogComponent {
  loading = false;
  error = '';

  constructor(
    private dialogRef: MatDialogRef<DeleteTransportistaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Transportista,
    private apiService: ApiService,
    private iconsService: IconsService
  ) {}

  onConfirm(): void {
    this.loading = true;
    this.error = '';

    this.apiService.delete<{success: boolean, message: string}>(`/transportistas/${this.data.id}`)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.dialogRef.close(true);
          } else {
            this.error = response.message || 'Error al eliminar el transportista';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error deleting transportista:', error);
          this.error = error.error?.message || 'Error de conexión al servidor';
          this.loading = false;
        }
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 