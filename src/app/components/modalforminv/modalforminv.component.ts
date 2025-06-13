// src/app/components/modalforminv/modalforminv.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BienesService } from '../../service/bienes.service';
import { TrabajadoresService } from '../../service/trabajadores.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ModalErrorFormComponent } from '../../modal-error-form/modal-error-form.component';


@Component({
  selector: 'app-modalforminv',
  templateUrl: './modalforminv.component.html',
  styleUrls: ['./modalforminv.component.css']
})
export class ModalforminvComponent {
  addProductForm: FormGroup;

  resguardanteControl: FormControl = new FormControl();
  trabajadores: any[] = [];
  filteredTrabajadores!: Observable<any[]>;

  constructor(
    public dialogRef: MatDialogRef<ModalforminvComponent>,
    private fb: FormBuilder,
    private bienesService: BienesService,
    private trabajadoresService: TrabajadoresService,
    private _matDialog: MatDialog, 
    private dialog: MatDialog
  ) {
    this.addProductForm = this.fb.group({
          numInvAnt: [''],
          numInvArm: [''],
          cControl: [''],
          nombreBien: ['', Validators.required],
          clasificacion: [''],
          clasAdic: [''],
          nombreCat: [''],
          descripcion: [''],
          marca: [''],      
          modelo: [''],      
          numSerie: [''],      
          aplicaRegCont: ['NO'],      
          grupoBienesCont: [''],      
          grupoBienesConac: [''],      
          categoria: [''],      
          subcategoria: [''],      
          tipoAlta: ['OTRO'],      
          facturaFisica: ['NO'],      
          fechaRecFact: [''],      
          numFact: [''],      
          fechaFact: [''],      
          fechaAlta: [''],      
          costoAdq: [0],      
          costoAdqCont: [0],      
          depreciacion: ['NO'],      
          frecDepre: ['NO APLICA'],      
          porcDepAnual: [0],      
          mesesDepre: [0],      
          impMensDepre: [0],      
          montoDepre: [0],      
          valLibros: [0],      
          mesesPendDepre: [0],      
          claveProyecto: [''],      
          apProye: ['NO'],
          partPres: [''],
          fuenteFinan: [''],
          numCuenta: [''],
          proveedor: [''],
          rfcProveedor: [''],
          domProveedor: [''],
          bienesMenores: [0],
          tipoResguardo: [''],
          nomRes: [''],
          numRes: [0],
          areaRes: [''],
          areaFunRes: [''],
          ubiRes: [''],
          observ1: [''],
          observ2: [''],
          comentCont: [''],
          seguimDesinc: [''],
          estatusBien: ['ALTA'],      
          motBaja: [''],      
          fechaBaja: [''],      
          aAdquisicion: [],      
          mAdquisicion: [''],      
          fotoBien: [''],      
          perfilRes: [''],      
          puestoRes: [''],      
          estatusRes: ['ACTIVO'],      
          correoPerRes: [''],      
          correoInstRes: [''], 
          rfcTrabaj: [''],     
          res16Ant: ['NO'],      
          res17: ['NO'],      
          res18: ['NO'],      
          res19: ['NO'],      
          res20: ['NO'],      
          res21: ['NO'],      
          res22: ['NO'],      
          res23: ['NO'],      
          res24: ['NO'],      
          estatusResguardo: ['ACTIVO'],      
          ultimoResguardo: [''],      
          etiqueta: ['NO'],
          idTrabajador: [null]
    });
  }
  
  ngOnInit(): void {
    // Suscribirse a los cambios en el select "depreciacion"
    this.addProductForm.get('depreciacion')?.valueChanges.subscribe(val => {
      if (val === 'SI') {
        this.addProductForm.patchValue({ frecDepre: 'MENSUAL' });
      } else {
        this.addProductForm.patchValue({ frecDepre: 'NO APLICA' });
      }
    });

    // Cargar la lista de trabajadores para el autocomplete
    this.trabajadoresService.getTrabajadores().subscribe(data => {
      this.trabajadores = data;
      this.filteredTrabajadores = this.resguardanteControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterTrabajadores(value))
      );
    });
  }

  private _filterTrabajadores(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.trabajadores.filter(trabajador =>
      trabajador.nombre.toLowerCase().includes(filterValue) ||
      trabajador.numero.toString().includes(filterValue)
    );
  }

  // Cuando se selecciona un trabajador del autocomplete
  seleccionarTrabajador(trabajador: any): void {
    this.addProductForm.patchValue({
      nomRes: trabajador.nombre,
      numRes: trabajador.numero,
      areaRes: trabajador.area,
      areaFunRes: trabajador.areaFuncional,
      ubiRes: trabajador.ubicacion,
      perfilRes: trabajador.perfilAcad,
      puestoRes: trabajador.puesto,
      estatusRes: trabajador.estatus,
      correoPerRes: trabajador.correoPersonal,
      correoInstRes: trabajador.correoInstit,
      rfcTrabaj: trabajador.rfcTrabaj,
      idTrabajador: trabajador.idTrabajador
    });
    this.resguardanteControl.setValue(trabajador.nombre);
  }
  
  onSubmit() {
    if (this.addProductForm.valid) {
      this.bienesService.addBien(this.addProductForm.value).subscribe(
        response => {
          console.log('Bien agregado exitosamente', response);
          this.dialogRef.close(true);
        },
        error => {
          console.error('Error al agregar el bien', error);
        }
      );
    } else {
      console.warn('Formulario inválido. Revisa los campos requeridos.');
      this.dialog.open(ModalErrorFormComponent, {
        disableClose: true
      });
      return;
    }
  }
  

  cerrarModal(): void {
    this.dialogRef.close();
    console.log('Modal de agregar bien cerrado');
  }
}
