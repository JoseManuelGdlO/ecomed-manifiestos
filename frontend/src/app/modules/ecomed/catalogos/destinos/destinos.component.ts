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
import { AddDestinoDialogComponent } from './add-destino-dialog/add-destino-dialog.component';
import { EditDestinoDialogComponent } from './edit-destino-dialog/edit-destino-dialog.component';
import { DeleteDestinoDialogComponent } from './delete-destino-dialog/delete-destino-dialog.component';

export interface Destino {
  id: number;
  nombre: string;
  descripcion?: string;
  razon_social: string;
  codigo_postal?: string;
  calle?: string;
  num_ext?: string;
  num_int?: string;
  colonia?: string;
  delegacion?: string;
  estado?: string;
  telefono?: string;
  correo_electronico?: string;
  autorizacion_semarnat?: string;
  nombre_encargado?: string;
  cargo_encargado?: string;
  observaciones?: string;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-destinos',
  templateUrl: './destinos.component.html',
  styleUrls: ['./destinos.component.scss'],
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
export class DestinosComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['id', 'nombre', 'razon_social', 'autorizacion_semarnat', 'telefono', 'actions'];
  dataSource: Destino[] = [];
  filteredData: Destino[] = [];
  
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
    this.loadDestinos();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  loadDestinos(): void {
    this.loading = true;
    this.error = '';

    const params = {
      page: this.currentPage + 1,
      limit: this.pageSize,
      sort: this.sortColumn,
      order: this.sortDirection,
      search: this.searchTerm
    };

    this.apiService.get<{success: boolean, data: Destino[], total: number}>('/destinos', params)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.dataSource = response.data;
            this.filteredData = response.data;
            this.totalItems = response.total;
          } else {
            this.error = 'Error al cargar los destinos';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading destinos:', error);
          this.error = 'Error de conexión al servidor';
          this.loading = false;
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadDestinos();
  }

  onSortChange(sort: Sort): void {
    this.sortColumn = sort.active;
    this.sortDirection = sort.direction;
    this.loadDestinos();
  }

  onSearchChange(): void {
    this.currentPage = 0;
    
    // Solo hacer búsqueda si se escriben 3 o más caracteres, o si está vacío
    if (this.searchTerm.trim().length === 0 || this.searchTerm.trim().length >= 3) {
      this.loadDestinos();
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 0;
    this.loadDestinos();
  }

  getDireccionCompleta(destino: Destino): string {
    const partes = [
      destino.calle,
      destino.num_ext,
      destino.num_int,
      destino.colonia,
      destino.delegacion,
      destino.estado,
      destino.codigo_postal
    ].filter(parte => parte && parte.trim() !== '');
    
    return partes.length > 0 ? partes.join(', ') : 'Sin dirección';
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddDestinoDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Recargar la lista de destinos después de agregar uno nuevo
        this.loadDestinos();
      }
    });
  }

  openEditDialog(destino: Destino): void {
    const dialogRef = this.dialog.open(EditDestinoDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: true,
      data: destino
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Recargar la lista de destinos después de editar
        this.loadDestinos();
      }
    });
  }

  openDeleteDialog(destino: Destino): void {
    const dialogRef = this.dialog.open(DeleteDestinoDialogComponent, {
      width: '400px',
      maxWidth: '90vw',
      disableClose: true,
      data: destino
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Recargar la lista de destinos después de eliminar
        this.loadDestinos();
      }
    });
  }
} 