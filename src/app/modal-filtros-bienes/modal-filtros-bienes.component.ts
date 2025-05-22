import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface Month { value: number; label: string; }

@Component({
  selector: 'app-modal-filtros-bienes',
  templateUrl: './modal-filtros-bienes.component.html',
  styleUrls: ['./modal-filtros-bienes.component.css']
})
export class ModalFiltrosBienesComponent implements OnInit {
  // —————— Filtro “Resguardante” ——————
  patrimonio = false;
  sujetoControl = false;

  // —————— Filtro “Alta” ——————
  mensual = false;
  trimestral = false;
  semestral = false;
  anual = false;
  filtroAnio: number | '' = '';
  filtroMes:  number | '' = '';

  // —————— Nuevo filtro “Donación” ——————
  donMensual    = false;
  donTrimestral = false;
  donSemestral  = false;
  donAnual      = false;
  donFiltroAnio: number | '' = '';
  donFiltroMes:  number | '' = '';

  years: number[] = [];
  months: Month[] = [
    { value: 1,  label: 'Enero' },
    { value: 2,  label: 'Febrero' },
    { value: 3,  label: 'Marzo' },
    { value: 4,  label: 'Abril' },
    { value: 5,  label: 'Mayo' },
    { value: 6,  label: 'Junio' },
    { value: 7,  label: 'Julio' },
    { value: 8,  label: 'Agosto' },
    { value: 9,  label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' }
  ];

  constructor(
    private dialogRef: MatDialogRef<ModalFiltrosBienesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    // Generar array de años 2016–2025
    for (let y = 2016; y <= new Date().getFullYear(); y++) {
      this.years.push(y);
    }
    // Si el padre nos envió un estado previo, lo cargamos:
    if (this.data) {
      Object.assign(this, {
        patrimonio:     !!this.data.patrimonio,
        sujetoControl:  !!this.data.sujetoControl,
        mensual:        !!this.data.mensual,
        trimestral:     !!this.data.trimestral,
        semestral:      !!this.data.semestral,
        anual:          !!this.data.anual,
        filtroAnio:     this.data.filtroAnio ?? '',
        filtroMes:      this.data.filtroMes  ?? '',
        donMensual:     !!this.data.donMensual,
        donTrimestral:  !!this.data.donTrimestral,
        donSemestral:   !!this.data.donSemestral,
        donAnual:       !!this.data.donAnual,
        donFiltroAnio:  this.data.donFiltroAnio ?? '',
        donFiltroMes:   this.data.donFiltroMes  ?? ''
      });
    }
  }

  // Mantener mutuamente exclusivo el grupo “Alta”
  onAltaChange(op: 'mensual'|'trimestral'|'semestral'|'anual') {
    this.mensual    = op === 'mensual';
    this.trimestral = op === 'trimestral';
    this.semestral  = op === 'semestral';
    this.anual      = op === 'anual';
  }

  // Mantener mutuamente exclusivo el grupo “Donación”
  onDonacionChange(op: 'mensual'|'trimestral'|'semestral'|'anual') {
    this.donMensual    = op === 'mensual';
    this.donTrimestral = op === 'trimestral';
    this.donSemestral  = op === 'semestral';
    this.donAnual      = op === 'anual';
  }

  limpiarFiltros(): void {
    this.patrimonio = this.sujetoControl = false;
    this.mensual = this.trimestral = this.semestral = this.anual = false;
    this.donMensual = this.donTrimestral = this.donSemestral = this.donAnual = false;
    this.filtroAnio = this.filtroMes = '';
    this.donFiltroAnio = this.donFiltroMes = '';
  }

  verResultados(): void {
    const noPrimario = !this.patrimonio && !this.sujetoControl;
    const noAlta     = !this.mensual && !this.trimestral && !this.semestral && !this.anual;
    const noDon      = !this.donMensual && !this.donTrimestral && !this.donSemestral && !this.donAnual;

    this.dialogRef.close({
      mostrarTodos: noPrimario && noAlta && noDon && this.filtroAnio === '' && this.filtroMes === '' && this.donFiltroAnio === '' && this.donFiltroMes === '',
      // primarios
      patrimonio: this.patrimonio,
      sujetoControl: this.sujetoControl,
      // alta
      mensual: this.mensual,
      trimestral: this.trimestral,
      semestral: this.semestral,
      anual: this.anual,
      filtroAnio: this.filtroAnio,
      filtroMes: this.filtroMes,
      // donación
      donMensual: this.donMensual,
      donTrimestral: this.donTrimestral,
      donSemestral: this.donSemestral,
      donAnual: this.donAnual,
      donFiltroAnio: this.donFiltroAnio,
      donFiltroMes: this.donFiltroMes
    });
  }
}
