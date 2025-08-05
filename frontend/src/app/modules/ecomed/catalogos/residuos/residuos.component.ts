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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from 'app/core/api/api.service';
import { AddResiduoDialogComponent } from './add-residuo-dialog/add-residuo-dialog.component';
import { EditResiduoDialogComponent } from './edit-residuo-dialog/edit-residuo-dialog.component';
import { DeleteResiduoDialogComponent } from './delete-residuo-dialog/delete-residuo-dialog.component';

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
  selector: 'app-residuos',
  templateUrl: './residuos.component.html',
  styleUrls: ['./residuos.component.scss'],
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
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ResiduosComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'codigo', 'peligroso', 'actions'];
  dataSource: Residuo[] = [];
  filteredData: Residuo[] = [];
  
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
    this.loadResiduos();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  loadResiduos(): void {
    this.loading = true;
    this.error = '';

    const params = {
      page: this.currentPage + 1,
      limit: this.pageSize,
      sort: this.sortColumn,
      order: this.sortDirection,
      search: this.searchTerm
    };

    this.apiService.get<{success: boolean, data: Residuo[], total: number}>('/residuos', params)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.dataSource = response.data;
            this.filteredData = response.data;
            this.totalItems = response.total;
          } else {
            this.error = 'Error al cargar los residuos';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading residuos:', error);
          this.error = 'Error de conexión al servidor';
          this.loading = false;
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadResiduos();
  }

  onSortChange(sort: Sort): void {
    this.sortColumn = sort.active;
    this.sortDirection = sort.direction;
    this.loadResiduos();
  }

  onSearchChange(): void {
    this.currentPage = 0;
    
    // Solo hacer búsqueda si se escriben 3 o más caracteres, o si está vacío
    if (this.searchTerm.trim().length === 0 || this.searchTerm.trim().length >= 3) {
      this.loadResiduos();
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 0;
    this.loadResiduos();
  }

  getPeligrosoColor(peligroso: boolean): string {
    return peligroso ? 'warn' : 'primary';
  }

  getPeligrosoText(peligroso: boolean): string {
    return peligroso ? 'Peligroso' : 'No Peligroso';
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddResiduoDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Recargar la lista de residuos después de agregar uno nuevo
        this.loadResiduos();
      }
    });
  }

  openEditDialog(residuo: Residuo): void {
    const dialogRef = this.dialog.open(EditResiduoDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      disableClose: true,
      data: residuo
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Recargar la lista de residuos después de editar
        this.loadResiduos();
      }
    });
  }

  openDeleteDialog(residuo: Residuo): void {
    const dialogRef = this.dialog.open(DeleteResiduoDialogComponent, {
      width: '400px',
      maxWidth: '90vw',
      disableClose: true,
      data: residuo
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Recargar la lista de residuos después de eliminar
        this.loadResiduos();
      }
    });
  }
} 