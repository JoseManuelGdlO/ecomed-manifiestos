import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from 'app/core/api/api.service';
import { Destino } from '../destinos.component';

@Component({
  selector: 'app-delete-destino-dialog',
  templateUrl: './delete-destino-dialog.component.html',
  styleUrls: ['./delete-destino-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ]
})
export class DeleteDestinoDialogComponent implements OnInit, OnDestroy {
  loading = false;
  error = '';

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private dialogRef: MatDialogRef<DeleteDestinoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Destino,
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

    this.apiService.delete<{success: boolean, message: string}>(`/destinos/${this.data.id}`)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.dialogRef.close(true);
          } else {
            this.error = response.message || 'Error al eliminar el destino';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error deleting destino:', error);
          this.error = 'Error de conexión al servidor';
          this.loading = false;
        }
      });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
} 