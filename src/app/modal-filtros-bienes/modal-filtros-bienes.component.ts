import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface Month {
  value: number;
  label: string;
}

@Component({
  selector: 'app-modal-filtros-bienes',
  templateUrl: './modal-filtros-bienes.component.html',
  styleUrls: ['./modal-filtros-bienes.component.css']
})
export class ModalFiltrosBienesComponent implements OnInit {
  // filtro "Bienes Muebles e intangibles"
  patrimonio = false;
  sujetoControl = false;

  // filtro "Alta de Bienes"
  mensual = false;
  trimestral = false;
  semestral = false;
  anual = false;

  filtroAnio: number | '' = '';
  filtroMes: number | '' = '';

  years: number[] = [];
  months: Month[] = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' }
  ];

  constructor(
    private dialogRef: MatDialogRef<ModalFiltrosBienesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    // Generar array de años desde 2016 hasta el actual
    const startYear = 2016;
    const currentYear = new Date().getFullYear();
    for (let y = startYear; y <= currentYear; y++) {
      this.years.push(y);
    }

    // Si el padre nos envió estado previo, lo cargamos
    if (this.data) {
      this.patrimonio     = !!this.data.patrimonio;
      this.sujetoControl  = !!this.data.sujetoControl;
      // si deseas también precargar estos nuevos filtros:
      this.mensual    = !!this.data.mensual;
      this.trimestral = !!this.data.trimestral;
      this.semestral  = !!this.data.semestral;
      this.anual      = !!this.data.anual;
      this.filtroAnio = this.data.filtroAnio ?? '';
      this.filtroMes  = this.data.filtroMes  ?? '';
    }
  }

  onAltaChange(opción: 'mensual'|'trimestral'|'semestral'|'anual') {
    this.mensual    = opción === 'mensual';
    this.trimestral = opción === 'trimestral';
    this.semestral  = opción === 'semestral';
    this.anual      = opción === 'anual';
  }

  limpiarFiltros(): void {
    // Vuelvo todo a false / vacío
    this.patrimonio = this.sujetoControl = false;
    this.mensual = this.trimestral = this.semestral = this.anual = false;
    this.filtroAnio = '';
    this.filtroMes  = '';
  }

  verResultados(): void {
    // Preparo objeto con TODO el estado de filtros
    const noPrimario = !this.patrimonio && !this.sujetoControl;
    const noAlta     = !this.mensual && !this.trimestral && !this.semestral && !this.anual;
    // cerrar devolviendo el estado completo
    this.dialogRef.close({
      mostrarTodos: noPrimario && noAlta && this.filtroAnio === '' && this.filtroMes === '',
      patrimonio: this.patrimonio,
      sujetoControl: this.sujetoControl,
      mensual:    this.mensual,
      trimestral: this.trimestral,
      semestral:  this.semestral,
      anual:      this.anual,
      filtroAnio: this.filtroAnio,
      filtroMes:  this.filtroMes
    });
  }
}
