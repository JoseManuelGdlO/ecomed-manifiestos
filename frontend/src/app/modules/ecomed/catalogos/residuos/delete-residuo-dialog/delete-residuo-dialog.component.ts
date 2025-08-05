import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from 'app/core/api/api.service';
import { IconsService } from 'app/core/icons/icons.service';

export interface Residuo {
  id: number;
  nombre: string;
  descripcion?: string;
  codigo?: string;
  peligroso: boolean;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-delete-residuo-dialog',
  templateUrl: './delete-residuo-dialog.component.html',
  styleUrls: ['./delete-residuo-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ]
})
export class DeleteResiduoDialogComponent {
  loading = false;
  error = '';

  constructor(
    private dialogRef: MatDialogRef<DeleteResiduoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Residuo,
    private apiService: ApiService,
    private iconsService: IconsService
  ) {}

  onConfirm(): void {
    this.loading = true;
    this.error = '';

    this.apiService.delete<{success: boolean, message: string}>(`/residuos/${this.data.id}`)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.dialogRef.close(true);
          } else {
            this.error = response.message || 'Error al eliminar el residuo';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error deleting residuo:', error);
          this.error = error.error?.message || 'Error de conexión al servidor';
          this.loading = false;
        }
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 