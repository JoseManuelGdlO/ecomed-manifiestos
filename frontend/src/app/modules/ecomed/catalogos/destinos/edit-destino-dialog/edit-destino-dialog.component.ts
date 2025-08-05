import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
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
import { Destino } from '../destinos.component';

@Component({
  selector: 'app-edit-destino-dialog',
  templateUrl: './edit-destino-dialog.component.html',
  styleUrls: ['./edit-destino-dialog.component.scss'],
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
export class EditDestinoDialogComponent implements OnInit, OnDestroy {
  destinoForm: FormGroup;
  loading = false;
  error = '';

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private dialogRef: MatDialogRef<EditDestinoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Destino,
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
    
    // Inicializar el formulario con los datos existentes
    this.destinoForm.patchValue({
      nombre: this.data.nombre || '',
      descripcion: this.data.descripcion || '',
      razon_social: this.data.razon_social || '',
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
      nombre_encargado: this.data.nombre_encargado || '',
      cargo_encargado: this.data.cargo_encargado || '',
      observaciones: this.data.observaciones || ''
    });
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

    this.apiService.put<{success: boolean, message: string, data: any}>(`/destinos/${this.data.id}`, destinoData)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.dialogRef.close(true);
          } else {
            this.error = response.message || 'Error al actualizar el destino';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating destino:', error);
          this.error = 'Error de conexión al servidor';
          this.loading = false;
        }
      });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
} 