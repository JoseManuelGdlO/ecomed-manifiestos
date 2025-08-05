import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from 'app/core/api/api.service';

export interface AddUsuarioData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  id_role: number;
}

export interface Role {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-add-usuario-dialog',
  templateUrl: './add-usuario-dialog.component.html',
  styleUrls: ['./add-usuario-dialog.component.scss'],
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
export class AddUsuarioDialogComponent implements OnInit, OnDestroy {
  usuarioForm: FormGroup;
  loading = false;
  error = '';
  roles: Role[] = [];

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private dialogRef: MatDialogRef<AddUsuarioDialogComponent>,
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) {
    this.usuarioForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      id_role: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadRoles();
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

  onSubmit(): void {
    if (this.usuarioForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const usuarioData = this.usuarioForm.value;

    this.apiService.post<{success: boolean, message: string, data: any}>('/users', usuarioData)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.dialogRef.close(true);
          } else {
            this.error = response.message || 'Error al crear el usuario';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error creating usuario:', error);
          this.error = 'Error de conexión al servidor';
          this.loading = false;
        }
      });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
} 