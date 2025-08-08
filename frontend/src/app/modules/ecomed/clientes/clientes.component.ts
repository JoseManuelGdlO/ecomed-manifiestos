import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from '../../../core/api/api.service';
import { AddClienteDialogComponent } from './add-cliente-dialog/add-cliente-dialog.component';
import { EditClienteDialogComponent } from './edit-cliente-dialog/edit-cliente-dialog.component';
import { DeleteClienteDialogComponent } from './delete-cliente-dialog/delete-cliente-dialog.component';

export interface Cliente {
  id: number;
  numero_registro_ambiental: string;
  nombre_razon_social: string;
  rfc: string;
  codigo_postal: string;
  calle: string;
  num_ext: string;
  num_int: string;
  colonia: string;
  delegacion: string;
  estado: string;
  telefono: string;
  email: string;
  zona: string;
  id_destino: number;
  id_transportista: number;
  destino?: {
    id: number;
    nombre: string;
    razon_social: string;
  };
  transportista?: {
    id: number;
    razon_social: string;
    placa: string;
  };
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    FormsModule
  ]
})
export class ClientesComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'id', 
    'numero_registro_ambiental', 
    'nombre_razon_social', 
    'rfc', 
    'telefono', 
    'email', 
    'zona', 
    'delegacion', 
    'estado', 
    'destino', 
    'transportista', 
    'actions'
  ];
  
  dataSource = new MatTableDataSource<Cliente>([]);
  loading = false;
  error = '';
  searchTerm = '';
  private searchTimeout: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadClientes();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }

  loadClientes(): void {
    this.loading = true;
    this.error = '';

    const params: any = {
      page: this.paginator?.pageIndex + 1 || 1,
      limit: this.paginator?.pageSize || 10
    };

    if (this.searchTerm.trim()) {
      params.search = this.searchTerm.trim();
    }

    if (this.sort?.active && this.sort?.direction) {
      params.sortBy = this.sort.active;
      params.sortOrder = this.sort.direction.toUpperCase();
    }

    this.apiService.get<{success: boolean, data: Cliente[], pagination: any}>('/clientes', params)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.dataSource.data = response.data;
            if (this.paginator) {
              this.paginator.length = response.pagination.total;
            }
          } else {
            this.error = 'Error al cargar los clientes';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading clientes:', error);
          this.error = 'Error de conexión al servidor';
          this.loading = false;
        }
      });
  }

  onPageChange(): void {
    this.loadClientes();
  }

  onSortChange(): void {
    this.loadClientes();
  }

  onSearchChange(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      if (this.paginator) {
        this.paginator.firstPage();
      }
      this.loadClientes();
    }, 500);
  }

  clearSearch(): void {
    this.searchTerm = '';
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.loadClientes();
  }

  getDestinoName(cliente: Cliente): string {
    return cliente.destino?.nombre || 'N/A';
  }

  getTransportistaName(cliente: Cliente): string {
    return cliente.transportista?.razon_social || 'N/A';
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddClienteDialogComponent, {
      width: '800px',
      maxHeight: '90vh',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadClientes();
      }
    });
  }

  openEditDialog(cliente: Cliente): void {
    const dialogRef = this.dialog.open(EditClienteDialogComponent, {
      width: '800px',
      maxHeight: '90vh',
      disableClose: true,
      data: cliente
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadClientes();
      }
    });
  }

  openDeleteDialog(cliente: Cliente): void {
    const dialogRef = this.dialog.open(DeleteClienteDialogComponent, {
      width: '500px',
      disableClose: true,
      data: cliente
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadClientes();
      }
    });
  }
} 