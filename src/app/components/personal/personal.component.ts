import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalAgregarPersonalComponent } from '../../modal-agregar-personal/modal-agregar-personal.component';
import { ModalVerPersonalComponent } from '../../modal-ver-personal/modal-ver-personal.component';
import { ModalEditarPersonalComponent } from '../../modal-editar-personal/modal-editar-personal.component';
import { ModalEliminarPersonalComponent } from '../../modal-eliminar-personal/modal-eliminar-personal.component';
import { TrabajadoresService } from '../../service/trabajadores.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css'],
})
export class PersonalComponent implements OnInit {
  trabajadores: any[] = [];
  trabajadoresFiltrados: any[] = [];
  paginatedTrabajadores: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  Math = Math; // Necesario para la paginación en el template

  estatusSeleccionado: string = ''; // Guarda el valor del filtro de estatus
  nombreBuscado: string = ''; // Guarda el valor del filtro de nombre

  constructor(
    private _matDialog: MatDialog,
    private trabajadoresService: TrabajadoresService
  ) {}

  ngOnInit(): void {
    this.trabajadoresService.getTrabajadores().subscribe((data) => {
      this.trabajadores = data;
      this.trabajadoresFiltrados = data; // Inicializamos los filtrados con todos los trabajadores
      this.updatePagination(); // Configuramos la paginación
    });
  }

  // Función para actualizar la paginación
  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedTrabajadores = this.trabajadoresFiltrados.slice(
      startIndex,
      endIndex
    );
  }

  nextPage(): void {
    if (
      this.currentPage * this.itemsPerPage <
      this.trabajadoresFiltrados.length
    ) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  // CRUD - Funciones del modal
  agregarPersonal(): void {
    const dialogRef = this._matDialog.open(ModalAgregarPersonalComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.trabajadoresService.getTrabajadores().subscribe((data) => {
          this.trabajadores = data;
          this.trabajadoresFiltrados = data;
          this.updatePagination();
        });
      }
    });
  }

  verrPersonal(id: number): void {
    const dialogRef = this._matDialog.open(ModalVerPersonalComponent, {
      data: { id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.trabajadoresService.getTrabajadores().subscribe((data) => {
          this.trabajadores = data;
          this.trabajadoresFiltrados = data;
          this.updatePagination();
        });
      }
    });
  }

  editarPersonal(trabajador: any): void {
    const dialogRef = this._matDialog.open(ModalEditarPersonalComponent, {
      data: trabajador,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.trabajadoresService.getTrabajadores().subscribe((data) => {
          this.trabajadores = data;
          this.trabajadoresFiltrados = data;
          this.updatePagination();
        });
      }
    });
  }

  eliminarPersonal(id: number): void {
    const dialogRef = this._matDialog.open(ModalEliminarPersonalComponent, {
      data: { id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.trabajadoresService.getTrabajadores().subscribe((data) => {
          this.trabajadores = data;
          this.trabajadoresFiltrados = data;
          this.updatePagination();
        });
      }
    });
  }

  // Filtro por estatus
  filtrarPorEstatus(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.estatusSeleccionado = selectElement.value;

    this.aplicarFiltros(); // Llama a la función de aplicar filtros acumulativos
  }

  // Filtro por nombre
  filtrarPorNombre(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.nombreBuscado = inputElement.value.toLowerCase();

    this.aplicarFiltros(); // Llama a la función de aplicar filtros acumulativos
  }

  // Función para aplicar filtros acumulativos
  aplicarFiltros(): void {
    this.trabajadoresFiltrados = this.trabajadores;

    // Filtra por estatus si se ha seleccionado alguno
    if (this.estatusSeleccionado && this.estatusSeleccionado !== 'AMBAS') {
      this.trabajadoresFiltrados = this.trabajadoresFiltrados.filter(
        (trabajador) => trabajador.estatus === this.estatusSeleccionado
      );
    }

    // Filtra por nombre si se ha escrito algo
    if (this.nombreBuscado) {
      this.trabajadoresFiltrados = this.trabajadoresFiltrados.filter(
        (trabajador) =>
          trabajador.nombre.toLowerCase().includes(this.nombreBuscado)
      );
    }

    this.currentPage = 1; // Reiniciar la paginación
    this.updatePagination();
  }
}
