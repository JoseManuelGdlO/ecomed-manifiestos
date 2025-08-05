import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from 'app/core/api/api.service';
import { Usuario } from '../usuarios.component';

export interface Role {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-edit-usuario-dialog',
  templateUrl: './edit-usuario-dialog.component.html',
  styleUrls: ['./edit-usuario-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    ReactiveFormsModule
  ]
})
export class EditUsuarioDialogComponent implements OnInit, OnDestroy {
  usuarioForm: FormGroup;
  loading = false;
  error = '';
  roles: Role[] = [];

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private dialogRef: MatDialogRef<EditUsuarioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Usuario,
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) {
    this.usuarioForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]], // Opcional para edición
      id_role: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadRoles();
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  loadRoles(): void {
    this.apiService.get<{success: boolean, data: Role[]}>('/roles')
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.roles = response.data;
          }
        },
        error: (error) => {
          console.error('Error loading roles:', error);
        }
      });
  }

  initializeForm(): void {
    this.usuarioForm.patchValue({
      nombre: this.data.nombre || '',
      apellido: this.data.apellido || '',
      email: this.data.email || '',
      password: '', // No mostrar contraseña actual
      id_role: this.data.id_role || ''
    });
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const usuarioData = this.usuarioForm.value;
    
    // Si no se proporciona contraseña, no enviarla
    if (!usuarioData.password) {
      delete usuarioData.password;
    }

    this.apiService.put<{success: boolean, message: string, data: any}>(`/users/${this.data.id}`, usuarioData)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.dialogRef.close(true);
          } else {
            this.error = response.message || 'Error al actualizar el usuario';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating usuario:', error);
          this.error = 'Error de conexión al servidor';
          this.loading = false;
        }
      });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
} 