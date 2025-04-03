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
    this.bienesFiltrados = [...this.bienes];
    
    this.currentPage = 0;
  });
}


  // Abrir el modal para editar un bien
  editarBien(bienEnTabla: any) {
    this.bienesService.getBien(bienEnTabla.idBien).subscribe((bien) => {
      console.log("Bien del servidor:", bien); // <-- comprueba si bien.nomRes existe
      this._matDialog.open(ModalEditarComponent, {
        data: { bien }
      }).afterClosed().subscribe((result) => {
        if (result === true) {
          this.cargarBienes();
        }
      });
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

  // Agrega una variable para recordar el estado de los filtros del modal:
private filtroEstado = {
  patrimonio: false,
  sujetoControl: false
};

// Función unificada para aplicar todos los filtros (checkboxes y texto)
aplicarTodosLosFiltros(): void {
  // Comienza con la lista completa de bienes
  let resultados = [...this.bienes];

  // 1) Aplica el filtro de checkboxes (si alguno está marcado)
  if (this.filtroEstado.patrimonio || this.filtroEstado.sujetoControl) {
    resultados = resultados.filter(bien => {
      // Normaliza el valor de tipoResguardo: quita espacios y pasa a mayúsculas
      const tipo = (bien.tipoResguardo || '').trim().toUpperCase();
      if (this.filtroEstado.patrimonio && this.filtroEstado.sujetoControl) {
        return tipo === 'PATRIMONIO' || tipo === 'SUJETO A CONTROL';
      } else if (this.filtroEstado.patrimonio) {
        return tipo === 'PATRIMONIO';
      } else if (this.filtroEstado.sujetoControl) {
        return tipo === 'SUJETO A CONTROL';
      }
      return true;
    });
  }

  // 2) Aplica el filtro textual (si se ha escrito algo en searchTerm)
  const texto = this.searchTerm.toLowerCase().trim();
  if (texto) {
    resultados = resultados.filter(bien => {
      const nombreBien = (bien.nombreBien || '').toLowerCase();
      const numInvAnt = (bien.numInvAnt || '').toLowerCase();
      const numInvArm = (bien.numInvArm || '').toLowerCase();
      return (
        nombreBien.includes(texto) ||
        numInvAnt.includes(texto) ||
        numInvArm.includes(texto)
      );
    });
  }

  // Asigna el resultado final a la lista filtrada y reinicia la paginación
  this.bienesFiltrados = resultados;
  this.currentPage = 0;
}

// Llama a esta función en el (input) del searchTerm
filtrarBienes(): void {
  // Actualiza la búsqueda y vuelve a aplicar todos los filtros
  this.aplicarTodosLosFiltros();
}

// En la función que cierra el modal de filtros:
filtrosBien(): void {
  if (!this.filtrosDialogRef) {
    const buttonElement = document.getElementById('btnFiltros');
    if (!buttonElement) return;

    const rect = buttonElement.getBoundingClientRect();
    const top = rect.top + rect.height;
    const left = rect.left;

    // Abre el modal, enviándole el estado actual
    this.filtrosDialogRef = this._matDialog.open(ModalFiltrosBienesComponent, {
      hasBackdrop: false,
      position: { top: `${top}px`, left: `${left}px` },
      data: { ...this.filtroEstado }
    });

    this.filtrosDialogRef.afterClosed().subscribe((result) => {
      this.filtrosDialogRef = null;
      if (!result) {
        // Se cerró sin aplicar filtro
        return;
      }
      if (result.mostrarTodos) {
        // Si no se marcó nada, resetea el estado y muestra todos los bienes
        this.filtroEstado = { patrimonio: false, sujetoControl: false };
      } else {
        // Actualiza el estado de los filtros con lo seleccionado
        this.filtroEstado = { 
          patrimonio: result.patrimonio, 
          sujetoControl: result.sujetoControl 
        };
      }
      // Aplica todos los filtros
      this.aplicarTodosLosFiltros();
    });
  } else {
    this.filtrosDialogRef.close();
  }
}
  
  
  
  
}

