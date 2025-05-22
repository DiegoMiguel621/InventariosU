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
// filtros de “Alta”
  private filtroAlta = {
    mensual:      false,
    trimestral:   false,
    semestral:    false,
    anual:        false,
    filtroAnio:   '' as number | '',
    filtroMes:    '' as number | ''
  };
// filtro de "Donación"
private filtroDonacion = {
  mensual:    false,
  trimestral: false,
  semestral:  false,
  anual:      false,
  filtroAnio: '' as number | '',
  filtroMes:  '' as number | ''
};

// Función unificada para aplicar todos los filtros (checkboxes y texto)
aplicarTodosLosFiltros(): void {
  let resultados = [...this.bienes];

  // (1) Filtro de resguardo
  const { patrimonio, sujetoControl } = this.filtroEstado;
  if (patrimonio || sujetoControl) {
    resultados = resultados.filter(b => {
      const tipo = (b.tipoResguardo || '').trim().toUpperCase();
      if (patrimonio && sujetoControl) {
        return tipo === 'PATRIMONIO' || tipo === 'SUJETO A CONTROL';
      }
      if (patrimonio)    return tipo === 'PATRIMONIO';
      if (sujetoControl) return tipo === 'SUJETO A CONTROL';
      return true;
    });
  }

  // (2) Filtro de texto
  const texto = this.searchTerm.toLowerCase().trim();
  if (texto) {
    resultados = resultados.filter(b =>
      [b.nombreBien, b.numInvAnt, b.numInvArm]
        .some(c => (c||'').toString().toLowerCase().includes(texto))
    );
  }

  // helper para periodos
  const filtrarPeriodo = (
    arr: any[],
    meses: number,
    anio: number | '',
    mes: number | '',
    tipos: string[]
  ) => {
    if (!meses || !anio || !mes) return [];
    const desde = new Date(+anio, (+mes) - 1, 1);
    const hasta = new Date(desde.getFullYear(), desde.getMonth() + meses, 1);
    return arr.filter(b => {
      const tAlta = (b.tipoAlta || '').toUpperCase();
      const fAlta = new Date(b.fechaAlta);
      return tipos.includes(tAlta) && fAlta >= desde && fAlta < hasta;
    });
  };

  // (3a) “Alta”
  const {
    mensual: altaMens,
    trimestral: altaTrim,
    semestral: altaSem,
    anual: altaAnu,
    filtroAnio: altaAnio,
    filtroMes: altaMes
  } = this.filtroAlta;

  const altaMeses = altaMens   ? 1
                   : altaTrim  ? 3
                   : altaSem   ? 6
                   : altaAnu   ? 12
                   : 0;

  const subsetAlta = filtrarPeriodo(
    resultados,
    altaMeses,
    altaAnio,
    altaMes,
    ['COMPRA','COMODATO','MENORES A 70 UMA','OTRO']
  );

  // (3b) “Donación”
  const {
    mensual: donMens,
    trimestral: donTrim,
    semestral: donSem,
    anual: donAnu,
    filtroAnio: donAnio,
    filtroMes: donMes
  } = this.filtroDonacion;

  const donaMeses = donMens    ? 1
                  : donTrim     ? 3
                  : donSem      ? 6
                  : donAnu      ? 12
                  : 0;

  const subsetDona = filtrarPeriodo(
    resultados,
    donaMeses,
    donAnio,
    donMes,
    ['DONACIÓN']
  );

  // (4) Si alguno de los dos periodos está activo, unimos los resultados
  if (altaMeses > 0 || donaMeses > 0) {
    const combinado = [...subsetAlta, ...subsetDona];
    const seen = new Set<number>();
    resultados = combinado.filter(b => {
      if (seen.has(b.idBien)) return false;
      seen.add(b.idBien);
      return true;
    });
  }

  // asigna y resetea paginación
  this.bienesFiltrados = resultados;
  this.currentPage = 0;
}


// Llama a esta función en el (input) del searchTerm
filtrarBienes(): void {
  this.aplicarTodosLosFiltros();
}


// En la función que cierra el modal de filtros:
filtrosBien(): void {
  if (!this.filtrosDialogRef) {
    // localiza el botón para calcular posición
    const btn = document.getElementById('btnFiltros');
    if (!btn) return;
    const { top, left, height } = btn.getBoundingClientRect();

    // abre el modal enviándole TODO el estado actual
    this.filtrosDialogRef = this._matDialog.open(ModalFiltrosBienesComponent, {
  hasBackdrop: false,
  position: { top: `${top+height}px`, left: `${left}px` },
  data: {
    ...this.filtroEstado,
    ...this.filtroAlta,
    // pasamos el estado actual de donación
    donMensual:    this.filtroDonacion.mensual,
    donTrimestral: this.filtroDonacion.trimestral,
    donSemestral:  this.filtroDonacion.semestral,
    donAnual:      this.filtroDonacion.anual,
    donFiltroAnio: this.filtroDonacion.filtroAnio,
    donFiltroMes:  this.filtroDonacion.filtroMes
  }
});

this.filtrosDialogRef.afterClosed().subscribe(result => {
      this.filtrosDialogRef = null;
      if (!result) return;

      if (result.mostrarTodos) {
        // resetea TODO
        this.filtroEstado   = { patrimonio:false, sujetoControl:false };
        this.filtroAlta     = { mensual:false, trimestral:false, semestral:false, anual:false, filtroAnio:'', filtroMes:'' };
        this.filtroDonacion = { mensual:false, trimestral:false, semestral:false, anual:false, filtroAnio:'', filtroMes:'' };
      } else {
        // actualiza con lo que llega del modal
        this.filtroEstado   = { patrimonio: result.patrimonio, sujetoControl: result.sujetoControl };
        this.filtroAlta     = {
          mensual:    result.mensual,
          trimestral: result.trimestral,
          semestral:  result.semestral,
          anual:      result.anual,
          filtroAnio: result.filtroAnio,
          filtroMes:  result.filtroMes
        };
        this.filtroDonacion = {
          mensual:    result.donMensual,
          trimestral: result.donTrimestral,
          semestral:  result.donSemestral,
          anual:      result.donAnual,
          filtroAnio: result.donFiltroAnio,
          filtroMes:  result.donFiltroMes
        };
      }

      // reaplica TODO
      this.aplicarTodosLosFiltros();
    });
  } else {
    this.filtrosDialogRef.close();
  }
}
     
}