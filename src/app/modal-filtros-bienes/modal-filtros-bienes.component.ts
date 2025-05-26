import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface Month { value: number; label: string; }

@Component({
  selector: 'app-modal-filtros-bienes',
  templateUrl: './modal-filtros-bienes.component.html',
  styleUrls: ['./modal-filtros-bienes.component.css']
})
export class ModalFiltrosBienesComponent implements OnInit {
  // —————— Filtro “tipo de resguardo” ——————
  patrimonio = false;
  sujetoControl = false;

  // —————— Filtro “Alta” ——————
  mensual = false;
  trimestral = false;
  semestral = false;
  anual = false;
  filtroAnio: number | '' = '';
  filtroMes:  number | '' = '';

  // —————— Filtro “Donación” ——————
  donMensual    = false;
  donTrimestral = false;
  donSemestral  = false;
  donAnual      = false;
  donFiltroAnio: number | '' = '';
  donFiltroMes:  number | '' = '';

    // Filtro "Comodato"
  comMensual     = false;
  comTrimestral  = false;
  comSemestral   = false;
  comAnual       = false;
  comFiltroAnio: number | '' = '';
  comFiltroMes:  number | '' = '';
  
  // —————— Filtro “Baja” ——————
  bajaMensual    = false;
  bajaTrimestral = false;
  bajaSemestral  = false;
  bajaAnual      = false;
  bajaFiltroAnio: number | '' = '';
  bajaFiltroMes:  number | '' = '';

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
        //Filtro “tipo de resguardo”
        patrimonio:     !!this.data.patrimonio,
        sujetoControl:  !!this.data.sujetoControl,
        // Filtro “Alta”
        mensual:        !!this.data.mensual,
        trimestral:     !!this.data.trimestral,
        semestral:      !!this.data.semestral,
        anual:          !!this.data.anual,
        filtroAnio:     this.data.filtroAnio ?? '',
        filtroMes:      this.data.filtroMes  ?? '',
        // Filtro “Donación”
        donMensual:     !!this.data.donMensual,
        donTrimestral:  !!this.data.donTrimestral,
        donSemestral:   !!this.data.donSemestral,
        donAnual:       !!this.data.donAnual,
        donFiltroAnio:  this.data.donFiltroAnio ?? '',
        donFiltroMes:   this.data.donFiltroMes  ?? '',
        // Filtro "Comodato"
        comMensual:     !!this.data.comMensual,
        comTrimestral:  !!this.data.comTrimestral,
        comSemestral:   !!this.data.comSemestral,
        comAnual:       !!this.data.comAnual,
        comFiltroAnio:  this.data.comFiltroAnio ?? '',
        comFiltroMes:   this.data.comFiltroMes  ?? '',
        // Filtro "Baja"
        bajaMensual:    !!this.data.bajaMensual,
        bajaTrimestral: !!this.data.bajaTrimestral,
        bajaSemestral:  !!this.data.bajaSemestral,
        bajaAnual:      !!this.data.bajaAnual,
        bajaFiltroAnio: this.data.bajaFiltroAnio ?? '',
        bajaFiltroMes:  this.data.bajaFiltroMes  ?? ''
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

  // Mantener mutuamente exclusivo el grupo “Comodato”
  onComodatoChange(opción: 'mensual'|'trimestral'|'semestral'|'anual') {
  this.comMensual    = opción === 'mensual';
  this.comTrimestral = opción === 'trimestral';
  this.comSemestral  = opción === 'semestral';
  this.comAnual      = opción === 'anual';
}
// Mantener mutuamente exclusivo el grupo “Baja”
  onBajaChange(op: 'mensual'|'trimestral'|'semestral'|'anual') {
    this.bajaMensual    = op === 'mensual';
    this.bajaTrimestral = op === 'trimestral';
    this.bajaSemestral  = op === 'semestral';
    this.bajaAnual      = op === 'anual';
  }

  limpiarFiltros(): void {
    this.patrimonio = this.sujetoControl = false;
    this.mensual = this.trimestral = this.semestral = this.anual = false;
    this.filtroAnio = this.filtroMes = '';
    this.donMensual = this.donTrimestral = this.donSemestral = this.donAnual = false;    
    this.donFiltroAnio = this.donFiltroMes = '';
    this.comMensual = this.comTrimestral = this.comSemestral = this.comAnual = false;
    this.comFiltroAnio = '';
    this.comFiltroMes  = '';
    this.bajaMensual = this.bajaTrimestral = this.bajaSemestral = this.bajaAnual = false;
    this.bajaFiltroAnio = this.bajaFiltroMes = '';
  }

  verResultados(): void {
    const noPrimario = !this.patrimonio && !this.sujetoControl;
    const noAlta     = !this.mensual && !this.trimestral && !this.semestral && !this.anual;
    const noDon      = !this.donMensual && !this.donTrimestral && !this.donSemestral && !this.donAnual;
    const noCom      = !this.comMensual && !this.comTrimestral && !this.comSemestral && !this.comAnual;
    const noBaja = !this.bajaMensual && !this.bajaTrimestral && !this.bajaSemestral && !this.bajaAnual;
    const mostrarTodos = noPrimario && noAlta && noDon && noCom &&
                     this.filtroAnio==='' && this.filtroMes==='' &&
                     this.donFiltroAnio==='' && this.donFiltroMes==='' &&
                     this.comFiltroAnio==='' && this.comFiltroMes===''&& 
                     this.bajaFiltroAnio==='' && this.bajaFiltroMes==='';

    this.dialogRef.close({
      mostrarTodos,
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
      donFiltroMes: this.donFiltroMes,
      //Comodato
      comMensual: this.comMensual,
      comTrimestral: this.comTrimestral,
      comSemestral: this.comSemestral,
      comAnual: this.comAnual,
      comFiltroAnio: this.comFiltroAnio,
      comFiltroMes: this.comFiltroMes,
      // “Baja”
      bajaMensual: this.bajaMensual,
      bajaTrimestral: this.bajaTrimestral,
      bajaSemestral: this.bajaSemestral,
      bajaAnual: this.bajaAnual,
      bajaFiltroAnio: this.bajaFiltroAnio,
      bajaFiltroMes: this.bajaFiltroMes
    });
  }
}
