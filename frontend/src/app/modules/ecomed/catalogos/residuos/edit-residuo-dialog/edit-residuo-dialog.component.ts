import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-edit-residuo-dialog',
  templateUrl: './edit-residuo-dialog.component.html',
  styleUrls: ['./edit-residuo-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EditResiduoDialogComponent implements OnInit {
  residuoForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private dialogRef: MatDialogRef<EditResiduoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Residuo,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private iconsService: IconsService
  ) {
    this.residuoForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      descripcion: [''],
      codigo: [''],
      peligroso: [false]
    });
  }

  ngOnInit(): void {
    // Cargar los datos del residuo en el formulario
    this.residuoForm.patchValue({
      nombre: this.data.nombre,
      descripcion: this.data.descripcion || '',
      codigo: this.data.codigo || '',
      peligroso: this.data.peligroso
    });
  }

  onSubmit(): void {
    if (this.residuoForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const residuoData = this.residuoForm.value;

    this.apiService.put<{success: boolean, data: any, message: string}>(`/residuos/${this.data.id}`, residuoData)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.dialogRef.close(response.data);
          } else {
            this.error = response.message || 'Error al actualizar el residuo';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating residuo:', error);
          this.error = error.error?.message || 'Error de conexión al servidor';
          this.loading = false;
        }
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 