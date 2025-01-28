import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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

  currentPage: number = 0;  // Índice de página actual
  pageSize: number = 12;    // cantidad de registros por página

  constructor(private _matDialog: MatDialog, private bienesService: BienesService) {}

  ngOnInit(): void {
    // Obtener los bienes y mostrarlos en la tabla
    this.bienesService.getBienes().subscribe(data => {
      this.bienes = data;
    });
  }
    // Calcula la cantidad total de páginas
    get totalPages(): number {
      return Math.ceil(this.bienes.length / this.pageSize);
    }

    // Avanza a la página siguiente
    nextPage(): void {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage++;
      }
    }

    // Retrocede a la página anterior
    previousPage(): void {
      if (this.currentPage > 0) {
        this.currentPage--;
      }
    }

  // Abrir el modal para agregar un bien
  agregarBien(): void {
    this._matDialog.open(ModalforminvComponent).afterClosed().subscribe((result) => {
      if (result === true) {
        this.cargarBienes(); // algún método que vuelve a llamar a getBienes()
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



  mostrarModalFiltros = false;

mostrarOcultarModal() {
  this.mostrarModalFiltros = !this.mostrarModalFiltros;
}

filtrosBien(): void {
  // 1) Obtener la referencia del botón
  const buttonElement = document.getElementById('btnFiltros');
  if (!buttonElement) {
    return;
  }

  // 2) Obtener posición y dimensiones del botón
  const rect = buttonElement.getBoundingClientRect();

  // 3) Calcular posición. Ej. poner el modal justo debajo del botón:
  const top = rect.top + rect.height;
  const left = rect.left;

  // 4) Abrir el modal con las coordenadas
  this._matDialog.open(ModalFiltrosBienesComponent, {
    hasBackdrop: true,    // para el fondo oscuro
    position: {
      // Le pasamos strings con “px” al final
      top: `${top}px`,
      left: `${left}px`
    }
  });
}
}

