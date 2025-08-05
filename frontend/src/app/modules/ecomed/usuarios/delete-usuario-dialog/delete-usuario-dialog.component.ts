import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from 'app/core/api/api.service';
import { Usuario } from '../usuarios.component';

@Component({
  selector: 'app-delete-usuario-dialog',
  templateUrl: './delete-usuario-dialog.component.html',
  styleUrls: ['./delete-usuario-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ]
})
export class DeleteUsuarioDialogComponent implements OnInit, OnDestroy {
  loading = false;
  error = '';

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private dialogRef: MatDialogRef<DeleteUsuarioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Usuario,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // Los iconos ya están registrados globalmente
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  onConfirm(): void {
    this.loading = true;
    this.error = '';

    this.apiService.delete<{success: boolean, message: string}>(`/users/${this.data.id}`)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.dialogRef.close(true);
          } else {
            this.error = response.message || 'Error al eliminar el usuario';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error deleting usuario:', error);
          this.error = 'Error de conexión al servidor';
          this.loading = false;
        }
      });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
} 