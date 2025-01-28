import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalforminvComponent } from '../modalforminv/modalforminv.component';
import { ModalEditarComponent } from '../modal-editar/modal-editar.component';
import { ModalVerComponent } from '../modal-ver/modal-ver.component';
import { ModalEliminarComponent } from '../modal-eliminar/modal-eliminar.component';
import { ModalFiltrosBienesComponent } from '../../modal-filtros-bienes/modal-filtros-bienes.component';
import { BienesService } from '../../service/bienes.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  bienes: any[] = [];
  bienesFiltrados: any[] = [];

  searchTerm: string = '';

  currentPage: number = 0;  // Índice de página actual
  pageSize: number = 12;    // cantidad de registros por página

  constructor(private _matDialog: MatDialog, private dialog: MatDialog, private bienesService: BienesService) {}

  ngOnInit(): void {
    // Obtener los bienes y mostrarlos en la tabla
    this.bienesService.getBienes().subscribe(data => {
      this.bienes = data;
      this.bienesFiltrados = [...this.bienes];
    });
  }
    // Calcula la cantidad total de páginas
    get totalPages(): number {
      return Math.ceil(this.bienes.length / this.pageSize);
    }

    filtrarBienes(): void {
      const texto = this.searchTerm.toLowerCase().trim();
  
      if (!texto) {
        // Si la búsqueda está vacía, mostrar todo
        this.bienesFiltrados = [...this.bienes];
        this.currentPage = 0; // volver a la primera página
        return;
      }
  
      // Filtramos por varios campos
      this.bienesFiltrados = this.bienes.filter(bien => {
        const nombreBien = (bien.nombreBien ?? '').toLowerCase();
        const numInvAnt = (bien.numInvAnt ?? '').toLowerCase();
        const numInvArm = (bien.numInvArm ?? '').toLowerCase();
  
        return (
          nombreBien.includes(texto) ||
          numInvAnt.includes(texto) ||
          numInvArm.includes(texto)
        );
      });      
      this.currentPage = 0;
    }
    
    nextPage(): void {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage++;
      }
    }
    
    previousPage(): void {
      if (this.currentPage > 0) {
        this.currentPage--;
      }
    }

  // Abrir el modal para agregar un bien
  agregarBien(): void {
    this._matDialog.open(ModalforminvComponent).afterClosed().subscribe((result) => {
      if (result === true) {
        this.cargarBienes(); 
      }
      console.log('Modal de agregar bien cerrado');
    });
  }
  cargarBienes() {
    this.bienesService.getBienes().subscribe(data => {
      this.bienes = data;
    });
  }

  // Abrir el modal para editar un bien
  editarBien(bien: any): void {
    this._matDialog.open(ModalEditarComponent, {
      data: { bien: bien }
    }).afterClosed().subscribe((result) => {
      if (result === true) {
        this.cargarBienes();
      }
    });
  }

  // Abrir el modal para ver los detalles de un bien
  VerBien(bien: any): void {
    console.log('Bien a ver:', bien);
    this._matDialog.open(ModalVerComponent, {
      data: { idBien: bien.idBien }
    }).afterClosed().subscribe(() => {
      console.log('Modal de ver bien cerrado');
    });
  }

  // Abrir el modal para eliminar un bien
  eliminarBien(id: number): void {
    this._matDialog.open(ModalEliminarComponent, {
      data: { idBien: id }
    }).afterClosed().subscribe((result) => {
      if (result === true) {
        this.cargarBienes();
      }
    });
  }

  private filtrosDialogRef: MatDialogRef<ModalFiltrosBienesComponent> | null = null;

  filtrosBien(): void {      
    if (!this.filtrosDialogRef) {
      const buttonElement = document.getElementById('btnFiltros');
      if (!buttonElement) {
        return;
      }
  
      const rect = buttonElement.getBoundingClientRect();
      const top = rect.top + rect.height;
      const left = rect.left;
  
      this.filtrosDialogRef = this._matDialog.open(ModalFiltrosBienesComponent, {
        hasBackdrop: false,
        position: {
          top: `${top}px`,
          left: `${left}px`
        }
      });
      
      this.filtrosDialogRef.afterClosed().subscribe(() => {
        this.filtrosDialogRef = null;
      });
    }     
    else {
      this.filtrosDialogRef.close();
    }
  }
  
}

