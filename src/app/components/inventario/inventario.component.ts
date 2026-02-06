import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalforminvComponent } from '../modalforminv/modalforminv.component';
import { ModalEditarComponent } from '../modal-editar/modal-editar.component';
import { ModalVerComponent } from '../modal-ver/modal-ver.component';
import { ModalEliminarComponent } from '../modal-eliminar/modal-eliminar.component';
import { ModalFiltrosBienesComponent } from '../../modal-filtros-bienes/modal-filtros-bienes.component';
import { ModalExportarReporteComponent } from '../modal-exportar-reporte/modal-exportar-reporte.component';
import { BienesService } from '../../service/bienes.service';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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

  abrirModalExport(): void {
  const dialogRef = this._matDialog.open(ModalExportarReporteComponent, {
    hasBackdrop: true,
    // …añade aquí posición o tamaño si lo necesitas
  });

  dialogRef.afterClosed().subscribe((formats: string[] | null) => {
    // formats es lo que devuelve tu modal: ['PDF'], ['Excel'], ['PDF','Excel'] o null
    if (!formats) return;

    if (formats.includes('PDF')) {
      this.exportPdf();
    }
    if (formats.includes('Excel')) {
      this.exportExcel(); // cuando lo implementes
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
//filtro de "Comodato"
private filtroComodato = {
  mensual:    false,
  trimestral: false,
  semestral:  false,
  anual:      false,
  filtroAnio: '' as number|'',
  filtroMes:  '' as number|''
};
// filtro de "Baja"
private filtroBaja = {
  mensual:    false,
  trimestral: false,
  semestral:  false,
  anual:      false,
  filtroAnio: '' as number|'',
  filtroMes:  '' as number|''
};
// filtro de "Tipo de bien"
private filtroTipoBien: string = '';
// filtro de "por Resguardante"
private filtroResguardante = '';
// filtro de "por Proyecto"
private filtroProyecto: string = '';
// filtro de "por area de adscripcion"
private filtroAreaRes: string = '';
// filtro de "área funcional"
private filtroAreaFunRes: string = '';
// filtro de “Estatus del Bien”
private filtroEstatus = {
  alta: false,
  baja: false
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
    ['COMPRA','MENORES A 70 UMA','OTRO']
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

  // (3c) “Comodato”
const comodMeses = this.filtroComodato.mensual    ? 1
                 : this.filtroComodato.trimestral ? 3
                 : this.filtroComodato.semestral  ? 6
                 : this.filtroComodato.anual      ? 12
                 : 0;

const subsetComodato = filtrarPeriodo(
  resultados,
  comodMeses,
  this.filtroComodato.filtroAnio,
  this.filtroComodato.filtroMes,
  ['COMODATO']
)
.filter(b => (b.estatusBien||'').toUpperCase() === 'ALTA');

// (3d) “Baja”
const bajaMeses = this.filtroBaja.mensual    ? 1
                : this.filtroBaja.trimestral ? 3
                : this.filtroBaja.semestral  ? 6
                : this.filtroBaja.anual      ? 12
                : 0;

const subsetBaja = bajaMeses > 0 && this.filtroBaja.filtroAnio && this.filtroBaja.filtroMes
  ? resultados.filter(b => {
      const est = (b.estatusBien || '').toUpperCase();
      const fB = new Date(b.fechaBaja);
      const desde = new Date(+this.filtroBaja.filtroAnio, (+this.filtroBaja.filtroMes) - 1, 1);
      const hasta = new Date(desde.getFullYear(), desde.getMonth() + bajaMeses, 1);
      return est === 'BAJA' && fB >= desde && fB < hasta;
    })
  : [];

  // (3E) Si hay ALTA o DONA o COMODA, unimos los tres subconjuntos
  if (altaMeses > 0 || donaMeses > 0 || comodMeses > 0 || bajaMeses  > 0) {
    const combinado = [...subsetAlta, ...subsetDona, ...subsetComodato, ...subsetBaja];
    const seen = new Set<number>();
    resultados = combinado.filter(b => {
      if (seen.has(b.idBien)) return false;
      seen.add(b.idBien);
      return true;
    });
  }

  // (4) “Tipo de Bien”
  if (this.filtroTipoBien) {
    resultados = resultados.filter(b =>
      this.normalizeStr(b.clasificacion || '') === this.filtroTipoBien
    );
  }
  // (5) "por resguardante"
  if (this.filtroResguardante) {
  resultados = resultados.filter(b =>
    (b.nomRes || '').toLowerCase() === this.filtroResguardante.toLowerCase()
  );
  }
  // (6) “Por Proyecto”
  if (this.filtroProyecto) {
    resultados = resultados.filter(b =>
      (b.claveProyecto || '').toString() === this.filtroProyecto
    );
  }

  // (7) “Por área de adscripción”
  if (this.filtroAreaRes) {
    resultados = resultados.filter(b =>
      (b.areaRes || '').toString() === this.filtroAreaRes
    );
  }

  // (8) “Por área funcional de resguardante”
  if (this.filtroAreaFunRes) {
    resultados = resultados.filter(b =>
      (b.areaFunRes || '').toString() === this.filtroAreaFunRes
    );
  }

  // (X) Filtro “Estatus del Bien”
  const { alta, baja } = this.filtroEstatus;
  if (alta || baja) {
    resultados = resultados.filter(b => {
      const est = (b.estatusBien || '').toUpperCase();
      if (alta) return est === 'ALTA';
      if (baja) return est === 'BAJA';
      return true;
    });
  }

  // asigna y resetea paginación
  this.bienesFiltrados = resultados;
  this.currentPage = 0;
}

exportPdf() {
  if (!this.bienesFiltrados.length) return;

  // 1) Define tus columnas completas
  interface ExportRow {
    no: number;
    numInvAnt:        any;
    numInvArm:        any;
    claveControl:     any;
    nombreBien:       any;
    clasificacion:    any;
    clasAdic:         any;
    nombreCat:        any;
    descripcion:      any;
    marca:            any;
    modelo:           any;
    numSerie:         any;
    aplicaRegCont:    any;
    grupoBienesCont:  any;
    grupoBienesCont2: any;
    categoria:        any;
    subcategoria:     any;
    tipoAlta:         any;
    facturaFisica:    any;
    fechaRecFact:     any;
    numFact:          any;
    fechaFact:        any;
    fechaAlta:        any;
    costoAdq:         any;
    costoAdqCont:     any;
    depreciacion:     any;
    frecDepre:        any;
    porcDepAnual:     any;
    mesesDepre:       any;
    impMensDepre:     any;
    montoDepre:       any;
    valLibros:        any;
    mesesPendDepre:   any;
    claveProyecto:    any;
    apProye:          any;
    partPres:         any;
    fuenteFinan:      any;
    numCuenta:        any;
    proveedor:        any;
    rfcProveedor:     any;
    domProveedor:     any;
    bienesMenores:    any;
    tipoResguardo:    any;
    observ1:          any;
    observ2:          any;
    comentCont:       any;
    seguimDesinc:     any;
    estatusBien:      any;
    motBaja:          any;
    fechaBaja:        any;
    aAdquisicion:     any;
    mAdquisicion:     any;
    fotoBien:         any;
    res16Ant:         any;
    res17:            any;
    res18:            any;
    res19:            any;
    res20:            any;
    res21:            any;
    res22:            any;
    res23:            any;
    res24:            any;
    estatusResguardo: any;
    ultimoResguardo:  any;
    etiqueta:         any;

    nomRes:        string;
    numRes:        string;
    areaRes:       string;
    areaFunRes:    string;
    ubiRes:        string;
    perfilRes:     string;
    puestoRes:     string;
    estatusRes:    string;
    correoPerRes: string;
    correoInstRes:     string;
    rfcTrabaj:         string;
  }
  const headers: { header: string; dataKey: keyof ExportRow }[] = [
    { header: 'No',               dataKey: 'no' },
  { header: 'Número de inventario anterior',        dataKey: 'numInvAnt' },
  { header: 'Número de inventario armonizado',        dataKey: 'numInvArm' },
  { header: 'clave de Control',     dataKey: 'claveControl' },
  { header: 'Nombre del Bien',       dataKey: 'nombreBien' },
  { header: 'Clasificación del bien',    dataKey: 'clasificacion' },
  { header: 'Clasificación Adicional del bien',         dataKey: 'clasAdic' },
  { header: 'Nombre del Bien (catálogo del CONAC)',        dataKey: 'nombreCat' },
  { header: 'Descripción del Bien',      dataKey: 'descripcion' },
  { header: 'Marca',            dataKey: 'marca' },
  { header: 'Modelo',           dataKey: 'modelo' },
  { header: 'Número de serie',         dataKey: 'numSerie' },
  { header: 'Aplica registro contable Si/No',    dataKey: 'aplicaRegCont' },
  { header: 'Grupo bienes (contabilidad)',  dataKey: 'grupoBienesCont' },
  { header: 'Grupo bienes (CONAC)', dataKey: 'grupoBienesCont2' },
  { header: 'Categoría (CONAC)',        dataKey: 'categoria' },
  { header: 'Subcategoría (CONAC)',     dataKey: 'subcategoria' },
  { header: 'Tipo de Alta',         dataKey: 'tipoAlta' },
  { header: 'Factura física/Documento oficial del Bien ',    dataKey: 'facturaFisica' },
  { header: 'Fecha recepción de factura',     dataKey: 'fechaRecFact' },
  { header: 'Número de factura',          dataKey: 'numFact' },
  { header: 'Fecha de factura',        dataKey: 'fechaFact' },
  { header: 'Fecha de alta del Bien',        dataKey: 'fechaAlta' },
  { header: 'Costo adquisición del Bien',         dataKey: 'costoAdq' },
  { header: 'Costo adquisición del Bien (contabilidad)',     dataKey: 'costoAdqCont' },
  { header: 'Con depreciación Si/No',     dataKey: 'depreciacion' },
  { header: 'Frecuencia depreciación',        dataKey: 'frecDepre' },
  { header: '% de Depreciación anual',     dataKey: 'porcDepAnual' },
  { header: 'Total meses a depreciar',       dataKey: 'mesesDepre' },
  { header: 'Importe de depre. mensual',     dataKey: 'impMensDepre' },
  { header: 'Monto depreciado	',       dataKey: 'montoDepre' },
  { header: 'Valor en libros',        dataKey: 'valLibros' },
  { header: 'Meses pendientes depreciar',   dataKey: 'mesesPendDepre' },
  { header: 'Clave del proyecto',    dataKey: 'claveProyecto' },
  { header: 'Aplica para proyecto Si/No',          dataKey: 'apProye' },
  { header: 'Partida presupuestal',         dataKey: 'partPres' },
  { header: 'Fuente de financiamiento',      dataKey: 'fuenteFinan' },
  { header: 'Número de cuenta',        dataKey: 'numCuenta' },
  { header: 'Nombre Proveedor',        dataKey: 'proveedor' },
  { header: 'RFC del proveedor',     dataKey: 'rfcProveedor' },
  { header: 'Domicilio Fiscal del proveedor',     dataKey: 'domProveedor' },
  { header: 'Bienes menores a 35 SMDF...',    dataKey: 'bienesMenores' },
  { header: 'Tipo de resguardo',    dataKey: 'tipoResguardo' },
  { header: 'Nombre del resguardante',            dataKey: 'nomRes' },
  { header: 'Número de resguardo',            dataKey: 'numRes' },
  { header: 'Área de adscripción del resguardante',           dataKey: 'areaRes' },
  { header: 'Área funcional del resguardante',        dataKey: 'areaFunRes' },
  { header: 'Ubicación física del resguardante',            dataKey: 'ubiRes' },
  { header: 'Observaciónes 1',          dataKey: 'observ1' },
  { header: 'Observaciónes 2',          dataKey: 'observ2' },
  { header: 'Comentarios del área de contabilidad',       dataKey: 'comentCont' },
  { header: 'Seguimiento del cómite de desincorporación de Bienes',     dataKey: 'seguimDesinc' },
  { header: 'Estatus del bien',      dataKey: 'estatusBien' },
  { header: 'Motivo de baja del bien',          dataKey: 'motBaja' },
  { header: 'Fecha de baja del bien',        dataKey: 'fechaBaja' },
  { header: 'Año de adquisición',     dataKey: 'aAdquisicion' },
  { header: 'Mes de adquisición	',     dataKey: 'mAdquisicion' },
  { header: 'Evidencia Fotográfica del bien',         dataKey: 'fotoBien' },
  { header: 'Perfil académico del resguardante',         dataKey: 'perfilRes' },
  { header: 'Puesto',         dataKey: 'puestoRes' },
  { header: 'Estatus laboral del resguardante',        dataKey: 'estatusRes' },
  { header: 'Correo personal del resguardante', dataKey: 'correoPerRes' },
  { header: 'Correo institucional del resguardante',     dataKey: 'correoInstRes' },
  { header: 'RFC resguardante	',         dataKey: 'rfcTrabaj' },
  { header: 'Resguardo 2016 y años anteriores',         dataKey: 'res16Ant' },
  { header: 'Resguardo 2017 Si/No',            dataKey: 'res17' },
  { header: 'Resguardo 2018 Si/No',            dataKey: 'res18' },
  { header: 'Resguardo 2019 Si/No',            dataKey: 'res19' },
  { header: 'Resguardo 2020 Si/No',            dataKey: 'res20' },
  { header: 'Resguardo 2021 Si/No',            dataKey: 'res21' },
  { header: 'Resguardo 2022 Si/No',            dataKey: 'res22' },
  { header: 'Resguardo 2023 Si/No',            dataKey: 'res23' },
  { header: 'Resguardo 2024 Si/No',            dataKey: 'res24' },
  { header: 'Estatus del resguardo', dataKey: 'estatusResguardo' },
  { header: 'Fecha de generación del Último resguardo',  dataKey: 'ultimoResguardo' },
  { header: 'El bien cuenta con Etiqueta',         dataKey: 'etiqueta' }
  ];

  // 2) Prepara las filas
  const rows: ExportRow[] = this.bienesFiltrados.map((b, i) => ({
    no:             i + 1,
    numInvAnt:            b.numInvAnt,
  numInvArm:            b.numInvArm,
  claveControl:         b.cControl,
  nombreBien:           b.nombreBien,
  clasificacion:        b.clasificacion,
  clasAdic:             b.clAdic,
  nombreCat:            b.nombreCat,
  descripcion:          b.descripcion,
  marca:                b.marca,
  modelo:               b.modelo,
  numSerie:             b.numSerie,
  aplicaRegCont:        b.aplicaRegCont,
  grupoBienesCont:      b.grupoBienesCont,
  grupoBienesCont2:     b.grupoBienesCont2,
  categoria:            b.categoria,
  subcategoria:         b.subcategoria,
  tipoAlta:             b.tipoAlta,
  facturaFisica:        b.facturaFisica,
  fechaRecFact:         b.fechaRecFact,
  numFact:              b.numFact,
  fechaFact:            b.fechaFact,
  fechaAlta:            b.fechaAlta,
  costoAdq:             b.costoAdq,
  costoAdqCont:         b.costoAdqCont,
  depreciacion:         b.depreciacion,
  frecDepre:            b.frecDepre,
  porcDepAnual:         b.porcDepAnual,
  mesesDepre:           b.mesesDepre,
  impMensDepre:         b.impMensDepre,
  montoDepre:           b.montoDepre,
  valLibros:            b.valLibros,
  mesesPendDepre:       b.mesesPendDepre,
  claveProyecto:        b.claveProyecto,
  apProye:              b.apProye,
  partPres:             b.partPres,
  fuenteFinan:          b.fuenteFinan,
  numCuenta:            b.numCuenta,
  proveedor:            b.proveedor,
  rfcProveedor:         b.rfcProveedor,
  domProveedor:         b.domProveedor,
  bienesMenores:        b.bienesMenores,
  tipoResguardo:        b.tipoResguardo,
  observ1:              b.observ1,
  observ2:              b.observ2,
  comentCont:           b.comentCont,
  seguimDesinc:         b.seguimDesinc,
  estatusBien:          b.estatusBien,
  motBaja:              b.motBaja,
  fechaBaja:            b.fechaBaja,
  aAdquisicion:         b.aAdquisicion,
  mAdquisicion:         b.mAdquisicion,
  fotoBien:             b.fotoBien,
  res16Ant:             b.res16Ant,
  res17:                b.res17,
  res18:                b.res18,
  res19:                b.res19,
  res20:                b.res20,
  res21:                b.res21,
  res22:                b.res22,
  res23:                b.res23,
  res24:                b.res24,
  estatusResguardo:     b.estatusResguardo,
  ultimoResguardo:      b.ultimoResguardo,
  etiqueta:             b.etiqueta,
  // ——— Resguardante ———
  nomRes:               b.nomRes,
  numRes:               b.numRes,
  areaRes:              b.areaRes,
  areaFunRes:           b.areaFunRes,
  ubiRes:               b.ubiRes,
  perfilRes:            b.perfilRes,
  puestoRes:            b.puestoRes,
  estatusRes:           b.estatusRes,
  correoPerRes:    b.correoPerRes,
  correoInstRes:        b.correoInstRes,
  rfcTrabaj:            b.rfcTrabaj
  }));

  // 3) Crea el PDF
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'letter'
  });

  // Función para dibujar el título
  const drawTitle = () => {
    doc.setFontSize(16);
    doc.text(
      'Reporte de Bienes Filtrados',
      doc.internal.pageSize.getWidth() / 2,
      40,
      { align: 'center' }
    );
  };

  // 4) Divide columnas en trozos de X
  const chunkSize = 6; // columnas por página
  for (let i = 0; i < headers.length; i += chunkSize) {
    const slice = headers.slice(i, i + chunkSize);

    if (i > 0) doc.addPage();          // añade nueva página a partir del segundo trozo
    drawTitle();

    autoTable(doc, {
      startY: 60,
      margin: { top: 60, bottom: 40, left: 40, right: 40 },

      // estilos generales
      styles: {
        fontSize: 8,
        cellWidth: 'wrap',
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: '#673AB7',
        textColor: 255
      },
      showHead: 'everyPage',

      // usa sólo el trozo actual de encabezados
      head: [ slice.map(h => h.header) ],
      body: rows.map(row =>
        slice.map(h => row[h.dataKey])
      )
    });
  }

  const hoy = new Date();
  const dd = String(hoy.getDate()).padStart(2, '0');
  const mm = String(hoy.getMonth() + 1).padStart(2, '0');
  const yyyy = hoy.getFullYear();
  // 5) Descarga el PDF
doc.save(`reporte_bienes_${dd}-${mm}-${yyyy}.pdf`);
}

normalizeStr(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
}

// Llama a esta función en el (input) del searchTerm
filtrarBienes(): void {
  this.aplicarTodosLosFiltros();
}

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
    ...this.filtroDonacion,
    ...this.filtroComodato,
    ...this.filtroBaja,
    tipoBien: this.filtroTipoBien,
    resguardante: this.filtroResguardante,
    proyecto: this.filtroProyecto,
    areaRes: this.filtroAreaRes,
    areaFunRes: this.filtroAreaFunRes,
    estatusAlta: this.filtroEstatus.alta,
    estatusBaja: this.filtroEstatus.baja,

    // pasamos el estado actual de los filtros
    patrimonio:     this.filtroEstado.patrimonio,
    sujetoControl:  this.filtroEstado.sujetoControl,

    mensual:        this.filtroAlta.mensual,
    trimestral:     this.filtroAlta.trimestral,
    semestral:      this.filtroAlta.semestral,
    anual:          this.filtroAlta.anual,
    filtroAnio:     this.filtroAlta.filtroAnio,
    filtroMes:      this.filtroAlta.filtroMes,

    donMensual:    this.filtroDonacion.mensual,
    donTrimestral: this.filtroDonacion.trimestral,
    donSemestral:  this.filtroDonacion.semestral,
    donAnual:      this.filtroDonacion.anual,
    donFiltroAnio: this.filtroDonacion.filtroAnio,
    donFiltroMes:  this.filtroDonacion.filtroMes,

    comMensual:    this.filtroComodato.mensual,
    comTrimestral: this.filtroComodato.trimestral,
    comSemestral:  this.filtroComodato.semestral,
    comAnual:      this.filtroComodato.anual,
    comFiltroAnio: this.filtroComodato.filtroAnio,
    comFiltroMes:  this.filtroComodato.filtroMes,

    bajaMensual:    this.filtroBaja.mensual,
    bajaTrimestral: this.filtroBaja.trimestral,
    bajaSemestral:  this.filtroBaja.semestral,
    bajaAnual:      this.filtroBaja.anual,
    bajaFiltroAnio: this.filtroBaja.filtroAnio,
    bajaFiltroMes:  this.filtroBaja.filtroMes
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
        this.filtroComodato  = { mensual:false, trimestral:false, semestral:false, anual:false, filtroAnio:'', filtroMes:'' };
        this.filtroBaja = { mensual:false, trimestral:false, semestral:false, anual:false, filtroAnio:'', filtroMes:'' };
        this.filtroTipoBien = '';
        this.filtroResguardante = '';
        this.filtroProyecto = '';
        this.filtroAreaRes = '';
        this.filtroAreaFunRes = '';
        this.filtroEstatus = { alta: false, baja: false };

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
        this.filtroComodato = {
          mensual:    result.comMensual,
          trimestral: result.comTrimestral,
          semestral:  result.comSemestral,
          anual:      result.comAnual,
          filtroAnio: result.comFiltroAnio,
          filtroMes:  result.comFiltroMes
        };
        this.filtroBaja = {
          mensual:    result.bajaMensual,
          trimestral: result.bajaTrimestral,
          semestral:  result.bajaSemestral,
          anual:      result.bajaAnual,
          filtroAnio: result.bajaFiltroAnio,
          filtroMes:  result.bajaFiltroMes
        };
        this.filtroTipoBien = result.tipoBien || '';
        this.filtroResguardante = result.resguardante || '';
        this.filtroProyecto = result.proyecto || '';
        this.filtroAreaRes = result.areaRes || '';
        this.filtroAreaFunRes = result.areaFunRes || '';
        this.filtroEstatus = {
          alta: result.estatusAlta,
          baja: result.estatusBaja
        };
      }
      // reaplica TODO
      this.aplicarTodosLosFiltros();
    });
  } else {
    this.filtrosDialogRef.close();
  }
}

// Declaracion de campos para el excel
private excelHeaders = [
  { header: 'No',                              dataKey: 'no' },
  { header: 'Número de inventario anterior',   dataKey: 'numInvAnt' },
  { header: 'Número de inventario armonizado', dataKey: 'numInvArm' },
  { header: 'Clave de control',                dataKey: 'cControl' },
  { header: 'Nombre del Bien',                 dataKey: 'nombreBien' },
  { header: 'Clasificación del bien',          dataKey: 'clasificacion' },
  { header: 'Clasificación Adicional del bien',dataKey: 'clasAdic' },
  { header: 'Nombre del Bien (catálogo CONAC)',dataKey: 'nombreCat' },
  { header: 'Descripción del Bien',            dataKey: 'descripcion' },
  { header: 'Marca',                           dataKey: 'marca' },
  { header: 'Modelo',                          dataKey: 'modelo' },
  { header: 'Número de serie',                 dataKey: 'numSerie' },
  { header: 'Aplica registro contable',        dataKey: 'aplicaRegCont' },
  { header: 'Grupo bienes (contabilidad)',     dataKey: 'grupoBienesCont' },
  { header: 'Grupo bienes (CONAC)',            dataKey: 'grupoBienesConac' },
  { header: 'Categoría (CONAC)',               dataKey: 'categoria' },
  { header: 'Subcategoría (CONAC)',            dataKey: 'subcategoria' },
  { header: 'Tipo de Alta',                    dataKey: 'tipoAlta' },
  { header: 'Factura física/DOC ingreso',      dataKey: 'facturaFisica' },
  { header: 'Fecha recepción factura',         dataKey: 'fechaRecFact' },
  { header: 'Número de factura',               dataKey: 'numFact' },
  { header: 'Fecha de factura',                dataKey: 'fechaFact' },
  { header: 'Fecha de alta del Bien',          dataKey: 'fechaAlta' },
  { header: 'Costo adquisición',               dataKey: 'costoAdq' },
  { header: 'Costo adquisición (contab.)',     dataKey: 'costoAdqCont' },
  { header: 'Con depreciación',                dataKey: 'depreciacion' },
  { header: 'Frecuencia depreciación',         dataKey: 'frecDepre' },
  { header: '% Depreciación anual',            dataKey: 'porcDepAnual' },
  { header: 'Meses a depreciar',               dataKey: 'mesesDepre' },
  { header: 'Imp. depreciación mensual',       dataKey: 'impMensDepre' },
  { header: 'Monto depreciado',                dataKey: 'montoDepre' },
  { header: 'Valor en libros',                 dataKey: 'valLibros' },
  { header: 'Meses pend. depreciar',           dataKey: 'mesesPendDepre' },
  { header: 'Clave del proyecto',              dataKey: 'claveProyecto' },
  { header: 'Aplica para proyecto',            dataKey: 'apProye' },
  { header: 'Partida presupuestal',            dataKey: 'partPres' },
  { header: 'Fuente de financiamiento',        dataKey: 'fuenteFinan' },
  { header: 'Número de cuenta',                dataKey: 'numCuenta' },
  { header: 'Proveedor',                       dataKey: 'proveedor' },
  { header: 'RFC proveedor',                   dataKey: 'rfcProveedor' },
  { header: 'Domicilio fiscal proveedor',      dataKey: 'domProveedor' },
  { header: 'Bienes menores a 35 SMDF',        dataKey: 'bienesMenores' },
  { header: 'Tipo de resguardo',               dataKey: 'tipoResguardo' },
  { header: 'Asignación (resguardante)',       dataKey: 'nomRes' },
  { header: 'Número de resguardo',             dataKey: 'numRes' },
  { header: 'Área de adscripción',             dataKey: 'areaRes' },
  { header: 'Área funcional',                  dataKey: 'areaFunRes' },
  { header: 'Ubicación física resguardante',   dataKey: 'ubiRes' },
  { header: 'Observaciones 1',                 dataKey: 'observ1' },
  { header: 'Observaciones 2',                 dataKey: 'observ2' },
  { header: 'Comentarios contabilidad',        dataKey: 'comentCont' },
  { header: 'Seguimiento del cómite de desincorporación de Bienes',          dataKey: 'seguimDesinc' },
  { header: 'Estatus del bien',                dataKey: 'estatusBien' },
  { header: 'Motivo de baja',                  dataKey: 'motBaja' },
  { header: 'Fecha de baja',                   dataKey: 'fechaBaja' },
  { header: 'Año adquisición',                 dataKey: 'aAdquisicion' },
  { header: 'Mes adquisición',                 dataKey: 'mAdquisicion' },
  { header: 'Evidencia fotográfica',           dataKey: 'fotoBien' },
  { header: 'Perfil académico resguardante',   dataKey: 'perfilRes' },
  { header: 'Puesto',                          dataKey: 'puestoRes' },
  { header: 'Estatus laboral',                 dataKey: 'estatusRes' },
  { header: 'Correo personal',                 dataKey: 'correoPerRes' },
  { header: 'Correo institucional',            dataKey: 'correoInstRes' },
  { header: 'RFC resguardante',                dataKey: 'rfcTrabaj' },
  { header: 'Resguardo 2016 y ant.',           dataKey: 'res16Ant' },
  { header: 'Resguardo 2017',                  dataKey: 'res17' },
  { header: 'Resguardo 2018',                  dataKey: 'res18' },
  { header: 'Resguardo 2019',                  dataKey: 'res19' },
  { header: 'Resguardo 2020',                  dataKey: 'res20' },
  { header: 'Resguardo 2021',                  dataKey: 'res21' },
  { header: 'Resguardo 2022',                  dataKey: 'res22' },
  { header: 'Resguardo 2023',                  dataKey: 'res23' },
  { header: 'Resguardo 2024',                  dataKey: 'res24' },
  { header: 'Estatus resguardo',               dataKey: 'estatusResguardo' },
  { header: 'Último resguardo',                dataKey: 'ultimoResguardo' },
  { header: 'Etiqueta',                        dataKey: 'etiqueta' },
];

exportExcel() {
  if (!this.bienesFiltrados.length) return;

  // 1) crea los datos
  const data = this.bienesFiltrados.map((b, i) => {
    const row: any = { No: i + 1 };

    for (const col of this.excelHeaders) {
      // si es la columna 'No', saltarla
      if (col.dataKey === 'no') continue;
      row[col.header] = b[col.dataKey] ?? '';
    }
    return row;
  });

  // 2) convierte a hoja y descarga igual que lo tienes…
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, {
    header: this.excelHeaders.map(h => h.header),
    skipHeader: false
  });

  // ajustar anchos, crear libro, descargar…
  const colWidths = this.excelHeaders.map(h => ({ wch: Math.max(h.header.length + 2, 10) }));
  ws['!cols'] = colWidths;

  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });

  const hoy = new Date();
  const dd = String(hoy.getDate()).padStart(2, '0');
  const mm = String(hoy.getMonth() + 1).padStart(2, '0');
  const yyyy = hoy.getFullYear();

  saveAs(blob, `Reporte_bienes_${dd}-${mm}-${yyyy}.xlsx`);
}


}
