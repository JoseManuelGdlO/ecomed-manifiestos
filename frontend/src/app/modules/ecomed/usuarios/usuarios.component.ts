import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from 'app/core/api/api.service';
import { AddUsuarioDialogComponent } from './add-usuario-dialog/add-usuario-dialog.component';
import { EditUsuarioDialogComponent } from './edit-usuario-dialog/edit-usuario-dialog.component';
import { DeleteUsuarioDialogComponent } from './delete-usuario-dialog/delete-usuario-dialog.component';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  id_role: number;
  role?: {
    id: number;
    nombre: string;
  };
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatToolbarModule,
    MatChipsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['id', 'nombre', 'apellido', 'email', 'role', 'actions'];
  dataSource: Usuario[] = [];
  filteredData: Usuario[] = [];
  
  // Pagination
  totalItems = 0;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];
  currentPage = 0;
  
  // Sorting
  sortColumn = 'id';
  sortDirection = 'asc';
  
  // Filtering
  searchTerm = '';
  
  // Loading state
  loading = false;
  error = '';
  
  // Search validation
  get isSearchValid(): boolean {
    return this.searchTerm.trim().length === 0 || this.searchTerm.trim().length >= 3;
  }
  
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsuarios();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  loadUsuarios(): void {
    this.loading = true;
    this.error = '';

    const params = {
      page: this.currentPage + 1,
      limit: this.pageSize,
      sort: this.sortColumn,
      order: this.sortDirection,
      search: this.searchTerm
    };

    this.apiService.get<{success: boolean, data: Usuario[], total: number}>('/users', params)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.dataSource = response.data;
            this.filteredData = response.data;
            this.totalItems = response.total;
          } else {
            this.error = 'Error al cargar los usuarios';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading usuarios:', error);
          this.error = 'Error de conexión al servidor';
          this.loading = false;
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsuarios();
  }

  onSortChange(sort: Sort): void {
    this.sortColumn = sort.active;
    this.sortDirection = sort.direction;
    this.loadUsuarios();
  }

  onSearchChange(): void {
    this.currentPage = 0;
    
    // Solo hacer búsqueda si se escriben 3 o más caracteres, o si está vacío
    if (this.searchTerm.trim().length === 0 || this.searchTerm.trim().length >= 3) {
      this.loadUsuarios();
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 0;
    this.loadUsuarios();
  }

  getNombreCompleto(usuario: Usuario): string {
    return `${usuario.nombre} ${usuario.apellido}`;
  }

  getRoleName(usuario: Usuario): string {
    return usuario.role?.nombre || 'Sin rol';
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddUsuarioDialogComponent, {
      width: '600px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Recargar la lista de usuarios después de agregar uno nuevo
        this.loadUsuarios();
      }
    });
  }

  openEditDialog(usuario: Usuario): void {
    const dialogRef = this.dialog.open(EditUsuarioDialogComponent, {
      width: '600px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: true,
      data: usuario
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Recargar la lista de usuarios después de editar
        this.loadUsuarios();
      }
    });
  }

  openDeleteDialog(usuario: Usuario): void {
    const dialogRef = this.dialog.open(DeleteUsuarioDialogComponent, {
      width: '400px',
      maxWidth: '90vw',
      disableClose: true,
      data: usuario
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Recargar la lista de usuarios después de eliminar
        this.loadUsuarios();
      }
    });
  }
} 