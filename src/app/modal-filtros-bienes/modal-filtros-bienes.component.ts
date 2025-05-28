import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BienesService } from '../service/bienes.service';

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

  // —————— Tipo de bien ——————
  filtroTipoBien: string = '';
  clasificaciones: string[] = [];
  filteredClasificaciones: string[] = [];

  // —————— Por resguardante ——————
  filtroResguardante = '';
  resguardantes: string[] = [];
  filteredResguardantes: string[] = [];

  // —————— por proyecto ——————
  filtroProyecto: string = '';
  proyectos: string[] = [];
  filteredProyectos: string[] = [];

  // —————— Por área de adscripción ——————
  filtroAreaRes: string = '';
  areasRes: string[] = [];
  filteredAreasRes: string[] = [];

  // —————— Por área funcional de resguardante ——————
  filtroAreaFunRes: string = '';
  areasFunRes: string[]           = [];
  filteredAreasFunRes: string[]   = [];

  // —————— Auxiliar para filtros de periodo ——————
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
    @Inject(MAT_DIALOG_DATA) public data: any,
    private bienesService: BienesService
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
    //tipo de bien
    this.bienesService.getBienes().subscribe(bienes => {
      const all = bienes.map(b => b.clasificacion || '');
      const norm = all
        .map(s => this.normalizeStr(s))
        .filter(s => !!s);
      this.clasificaciones = Array.from(new Set(norm)).sort();
      this.filteredClasificaciones = [...this.clasificaciones];

      // si venimos con un tipo seleccionado, recárgalo
      if (this.data?.tipoBien) {
        this.filtroTipoBien = this.data.tipoBien;
        this.onTipoBienSearch(this.filtroTipoBien);
      }        
    });

    //por resguardante
    this.bienesService.getBienes().subscribe(bienes => {
      
  this.resguardantes = Array.from(
    new Set(bienes.map(b => b.nomRes || '').filter(x => !!x))
  ).sort();
  this.filteredResguardantes = [...this.resguardantes];

  // cargar valor previo si viene
  if (this.data?.resguardante) {
    this.filtroResguardante = this.data.resguardante;
    this.onResguardanteSearch(this.filtroResguardante);
  }
  });

  //por proyecto
  this.bienesService.getBienes().subscribe(bienes => {
      // EXTRAEMOS Y UNIFICAMOS claves de proyecto
      const allClaves = bienes
        .map(b => (b.claveProyecto || '').toString().trim())
        .filter(s => !!s);
      this.proyectos = Array.from(new Set(allClaves)).sort();
      this.filteredProyectos = [...this.proyectos];

      // si venimos con uno preseleccionado
      if (this.data?.proyecto) {
        this.filtroProyecto = this.data.proyecto;
        this.onProyectoSearch(this.filtroProyecto);
      }
    });
    
    //por area de adscripcion
    this.bienesService.getBienes().subscribe(bienes => {      
      const allAreas = bienes
        .map(b => (b.areaRes || '').toString().trim())
        .filter(s => !!s);
      this.areasRes = Array.from(new Set(allAreas)).sort();
      this.filteredAreasRes = [...this.areasRes];

      if (this.data?.areaRes) {
        this.filtroAreaRes = this.data.areaRes;
        this.onAreaResSearch(this.filtroAreaRes);
      }
    });

    this.bienesService.getBienes().subscribe(bienes => {
      // … después de áreas de adscripción …
      const allFun = bienes
        .map(b => (b.areaFunRes || '').toString().trim())
        .filter(s => !!s);
      this.areasFunRes = Array.from(new Set(allFun)).sort();
      this.filteredAreasFunRes = [...this.areasFunRes];

      // Si venimos con área funcional preseleccionada:
      if (this.data?.areaFunRes) {
        this.filtroAreaFunRes = this.data.areaFunRes;
        this.onAreaFunResSearch(this.filtroAreaFunRes);
      }
    });

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

  onResguardanteSearch(q: string) {
  this.filteredResguardantes = this.resguardantes.filter(r =>
    r.toLowerCase().includes((q||'').toLowerCase())
  );
  }

  onProyectoSearch(value: string) {
    const q = (value || '').toUpperCase();
    this.filteredProyectos = this.proyectos.filter(p =>
      p.toUpperCase().includes(q)
    );
  }

  onAreaResSearch(value: string) {
    const q = (value || '').toUpperCase();
    this.filteredAreasRes = this.areasRes.filter(a =>
      a.toUpperCase().includes(q)
    );
  }

  
  onAreaFunResSearch(value: string) {
    const q = (value || '').toUpperCase();
    this.filteredAreasFunRes = this.areasFunRes.filter(a =>
      a.toUpperCase().includes(q)
    );
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
    this.filtroTipoBien = '';
    this.filteredClasificaciones = [...this.clasificaciones];
    this.filtroResguardante = '';
    this.filteredResguardantes = [...this.resguardantes];
    this.filtroProyecto = '';
    this.filteredProyectos = [...this.proyectos];
    this.filtroAreaRes = '';
    this.filteredAreasRes = [...this.areasRes];
    this.filtroAreaFunRes = '';
  }

  /** Quita tildes y pasa a mayúsculas */
  normalizeStr(s: string): string {
    return s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase();
  }

  /** Filtra el dropdown según lo que escribe el usuario */
  onTipoBienSearch(value: string) {
    const q = this.normalizeStr(value || '');
    this.filteredClasificaciones = this.clasificaciones.filter(c =>
      c.includes(q)
    );
  }

  verResultados(): void {
    const noPrimario = !this.patrimonio && !this.sujetoControl;
    const noAlta     = !this.mensual && !this.trimestral && !this.semestral && !this.anual;
    const noDon      = !this.donMensual && !this.donTrimestral && !this.donSemestral && !this.donAnual;
    const noCom      = !this.comMensual && !this.comTrimestral && !this.comSemestral && !this.comAnual;
    const noBaja = !this.bajaMensual && !this.bajaTrimestral && !this.bajaSemestral && !this.bajaAnual;
    const noTipoBien = this.filtroTipoBien === '';
    const noResguardante   = this.filtroResguardante === '';
    const noProyecto = this.filtroProyecto === '';
    const noAreaRes = this.filtroAreaRes === '';
    const noAreaFunRes = this.filtroAreaFunRes === '';

    const mostrarTodos = noPrimario && noAlta && noDon && noCom && noBaja && noTipoBien && noResguardante && noProyecto && noAreaRes && noAreaFunRes &&
                     this.filtroAnio==='' && this.filtroMes==='' &&
                     this.donFiltroAnio==='' && this.donFiltroMes==='' &&
                     this.comFiltroAnio==='' && this.comFiltroMes===''&& 
                     this.bajaFiltroAnio==='' && this.bajaFiltroMes==='';
    

    this.dialogRef.close({
      mostrarTodos,
      // primarios
      patrimonio: this.patrimonio,
      sujetoControl: this.sujetoControl,
      // altas
      mensual: this.mensual,
      trimestral: this.trimestral,
      semestral: this.semestral,
      anual: this.anual,
      filtroAnio: this.filtroAnio,
      filtroMes: this.filtroMes,
      // donaciones
      donMensual: this.donMensual,
      donTrimestral: this.donTrimestral,
      donSemestral: this.donSemestral,
      donAnual: this.donAnual,
      donFiltroAnio: this.donFiltroAnio,
      donFiltroMes: this.donFiltroMes,
      //Comodatos
      comMensual: this.comMensual,
      comTrimestral: this.comTrimestral,
      comSemestral: this.comSemestral,
      comAnual: this.comAnual,
      comFiltroAnio: this.comFiltroAnio,
      comFiltroMes: this.comFiltroMes,
      // Bajas
      bajaMensual: this.bajaMensual,
      bajaTrimestral: this.bajaTrimestral,
      bajaSemestral: this.bajaSemestral,
      bajaAnual: this.bajaAnual,
      bajaFiltroAnio: this.bajaFiltroAnio,
      bajaFiltroMes: this.bajaFiltroMes,
      // Tipo de bien
      tipoBien: this.filtroTipoBien,
      //Resguardante
      resguardante: this.filtroResguardante,
      proyecto: this.filtroProyecto,
      areaRes: this.filtroAreaRes,
      areaFunRes: this.filtroAreaFunRes
    });
  }
}
