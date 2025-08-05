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
import { AddTransportistaDialogComponent } from './add-transportista-dialog/add-transportista-dialog.component';
import { EditTransportistaDialogComponent } from './edit-transportista-dialog/edit-transportista-dialog.component';
import { DeleteTransportistaDialogComponent } from './delete-transportista-dialog/delete-transportista-dialog.component';

export interface Transportista {
  id: number;
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
  permiso_sct?: string;
  tipo_vehiculo?: string;
  placa?: string;
  ruta_empresa?: string;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-transportistas',
  templateUrl: './transportistas.component.html',
  styleUrls: ['./transportistas.component.scss'],
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
export class TransportistasComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['id', 'razon_social', 'placa', 'autorizacion_semarnat', 'permiso_sct', 'telefono', 'actions'];
  dataSource: Transportista[] = [];
  filteredData: Transportista[] = [];
  
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
    this.loadTransportistas();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  loadTransportistas(): void {
    this.loading = true;
    this.error = '';

    const params = {
      page: this.currentPage + 1,
      limit: this.pageSize,
      sort: this.sortColumn,
      order: this.sortDirection,
      search: this.searchTerm
    };

    this.apiService.get<{success: boolean, data: Transportista[], total: number}>('/transportistas', params)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.dataSource = response.data;
            this.filteredData = response.data;
            this.totalItems = response.total;
          } else {
            this.error = 'Error al cargar los transportistas';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading transportistas:', error);
          this.error = 'Error de conexión al servidor';
          this.loading = false;
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTransportistas();
  }

  onSortChange(sort: Sort): void {
    this.sortColumn = sort.active;
    this.sortDirection = sort.direction;
    this.loadTransportistas();
  }

  onSearchChange(): void {
    this.currentPage = 0;
    
    // Solo hacer búsqueda si se escriben 3 o más caracteres, o si está vacío
    if (this.searchTerm.trim().length === 0 || this.searchTerm.trim().length >= 3) {
      this.loadTransportistas();
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 0;
    this.loadTransportistas();
  }

  getDireccionCompleta(transportista: Transportista): string {
    const partes = [
      transportista.calle,
      transportista.num_ext,
      transportista.num_int,
      transportista.colonia,
      transportista.delegacion,
      transportista.estado,
      transportista.codigo_postal
    ].filter(parte => parte && parte.trim() !== '');
    
    return partes.length > 0 ? partes.join(', ') : 'Sin dirección';
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddTransportistaDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Recargar la lista de transportistas después de agregar uno nuevo
        this.loadTransportistas();
      }
    });
  }

  openEditDialog(transportista: Transportista): void {
    const dialogRef = this.dialog.open(EditTransportistaDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: true,
      data: transportista
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Recargar la lista de transportistas después de editar
        this.loadTransportistas();
      }
    });
  }

  openDeleteDialog(transportista: Transportista): void {
    const dialogRef = this.dialog.open(DeleteTransportistaDialogComponent, {
      width: '400px',
      maxWidth: '90vw',
      disableClose: true,
      data: transportista
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Recargar la lista de transportistas después de eliminar
        this.loadTransportistas();
      }
    });
  }
} 