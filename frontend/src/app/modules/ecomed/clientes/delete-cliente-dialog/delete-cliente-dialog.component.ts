import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from '../../../../core/api/api.service';
import { Cliente } from '../clientes.component';

@Component({
  selector: 'app-delete-cliente-dialog',
  templateUrl: './delete-cliente-dialog.component.html',
  styleUrls: ['./delete-cliente-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ]
})
export class DeleteClienteDialogComponent {
  loading = false;
  error = '';
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private dialogRef: MatDialogRef<DeleteClienteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Cliente,
    private apiService: ApiService
  ) {}

  onConfirm(): void {
    this.loading = true;
    this.error = '';

    this.apiService.delete<{success: boolean, message: string}>(`/clientes/${this.data.id}`)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.dialogRef.close(true);
          } else {
            this.error = response.message || 'Error al eliminar el cliente';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error deleting cliente:', error);
          this.error = 'Error de conexión al servidor';
          this.loading = false;
        }
      });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
} 