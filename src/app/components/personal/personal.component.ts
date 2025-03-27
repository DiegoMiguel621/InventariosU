import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalAgregarPersonalComponent } from '../../modal-agregar-personal/modal-agregar-personal.component';
import { ModalVerPersonalComponent } from '../../modal-ver-personal/modal-ver-personal.component';
import { ModalEditarPersonalComponent } from '../../modal-editar-personal/modal-editar-personal.component';
import { ModalEliminarPersonalComponent } from '../../modal-eliminar-personal/modal-eliminar-personal.component';
import { ModalRestaurarTrabajador3Component } from '../modal-restaurar-trabajador3/modal-restaurar-trabajador3.component';
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
  estatusSeleccionado: string = '';
  nombreBusqueda: string = '';
  numeroBusqueda: string = '';
  areaSeleccionada: string = '';
  areas: string[] = [];

  mostrarInactivos: boolean = false;

  Math = Math; // Exponemos Math para usar Math.ceil en el template

  constructor(
    private _matDialog: MatDialog,
    private trabajadoresService: TrabajadoresService
  ) {}

  ngOnInit(): void {
    // Cargar trabajadores
    this.trabajadoresService.getTrabajadores().subscribe((data) => {
      this.trabajadores = data;
      this.trabajadoresFiltrados = [...data];
      this.updatePagination();
    });

    // Cargar áreas desde el servicio
    this.trabajadoresService.getAreas().subscribe((areas: string[]) => {
      this.areas = ['CUALQUIER AREA', ...areas]; // Agregar "CUALQUIER AREA"
    });
  }

  // Llamar a getTrabajadores() para cargar activos
  cargarActivos(): void {
    this.trabajadoresService.getTrabajadores().subscribe((data) => {
      this.trabajadores = data;
      this.trabajadoresFiltrados = [...data];
      this.updatePagination();
    });
  }

  // Llamar a getTrabajadoresInactivos() para cargar inactivos
  cargarInactivos(): void {
    this.trabajadoresService.getTrabajadoresInactivos().subscribe((data) => {
      this.trabajadores = data;
      this.trabajadoresFiltrados = [...data];
      this.updatePagination();
    });
  }

  // Botón Historial => Toggle entre activos e inactivos
  toggleHistorial(): void {
    this.mostrarInactivos = !this.mostrarInactivos;
    if (this.mostrarInactivos) {
      // Cargar inactivos
      this.cargarInactivos();
    } else {
      // Cargar activos
      this.cargarActivos();
    }
  }

  // Función para aplicar filtros combinados
  usarFiltros(): void {
    let resultados = [...this.trabajadores];
  
    // Filtro por estatus
    if (this.estatusSeleccionado && this.estatusSeleccionado !== 'AMBAS') {
      resultados = resultados.filter(
        (trabajador) => trabajador.estatus === this.estatusSeleccionado
      );
    }
  
    // Filtro por nombre
    if (this.nombreBusqueda) {
      resultados = resultados.filter((trabajador) =>
        this.normalizarTexto(trabajador.nombre).includes(
          this.normalizarTexto(this.nombreBusqueda)
        )
      );
    }
  
    // Filtro por número
    if (this.numeroBusqueda) {
      resultados = resultados.filter((trabajador) =>
        trabajador.numero.includes(this.numeroBusqueda)
      );
    }
  
    // Filtro por área
    if (this.areaSeleccionada && this.areaSeleccionada !== 'CUALQUIER AREA') {
      resultados = resultados.filter((trabajador) =>
        this.normalizarTexto(trabajador.area).includes(
          this.normalizarTexto(this.areaSeleccionada)
        )
      );
    }
  
    this.trabajadoresFiltrados = resultados;
    this.updatePagination(); // Actualizar paginación después de filtrar
  }
  

  // Filtros individuales que llaman a usarFiltros
  filtrarPorEstatus(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.estatusSeleccionado = selectElement.value;
    this.usarFiltros();
  }

  filtrarPorNombre(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.nombreBusqueda = inputElement.value;
    this.usarFiltros();
  }

  filtrarPorNumero(): void {
    if (this.numeroBusqueda) {
      this.trabajadoresFiltrados = this.trabajadoresFiltrados.filter((trabajador) =>
        trabajador.numero.toString().includes(this.numeroBusqueda)
      );
    } else {
      // Si el campo está vacío, reseteamos el filtro y volvemos a aplicar los demás filtros
      this.usarFiltros();
    }
    this.updatePagination(); // Aseguramos que la paginación sea correcta después del filtro
  }
  

  filtrarPorArea(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.areaSeleccionada = selectElement.value;
    this.usarFiltros();
  }

  // Normalizar texto para búsquedas insensibles a mayúsculas y acentos
  normalizarTexto(texto: string): string {
    return texto
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Elimina los acentos
  }

  // Funciones de paginación
  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedTrabajadores = this.trabajadoresFiltrados.slice(
      startIndex,
      endIndex
    );
  }

  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.trabajadoresFiltrados.length) {
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

  // CRUD Functions (sin cambios)
  agregarPersonal(): void {
    const dialogRef = this._matDialog.open(ModalAgregarPersonalComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.trabajadoresService.getTrabajadores().subscribe((data) => {
          this.trabajadores = data;
          this.trabajadoresFiltrados = [...data];
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
          this.trabajadoresFiltrados = [...data];
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
          this.trabajadoresFiltrados = [...data];
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
          this.trabajadoresFiltrados = [...data];
          this.updatePagination();
        });
      }
    });
  }
  recuperarPersonal(id: number): void {
    const dialogRef = this._matDialog.open(ModalRestaurarTrabajador3Component, {
      data: { id }
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        // Recargamos la lista de inactivos
        this.cargarInactivos();
      }
    });
  }
  
  
}
