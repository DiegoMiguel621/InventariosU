import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BienesService } from '../../service/bienes.service';
import { TrabajadoresService } from '../../service/trabajadores.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-modal-editar',
  templateUrl: './modal-editar.component.html',
  styleUrls: ['./modal-editar.component.css']
})
export class ModalEditarComponent implements OnInit {
  editBienForm!: FormGroup;
  // Control para el autocomplete del resguardante
  resguardanteControl: FormControl = new FormControl();
  trabajadores: any[] = [];
  filteredTrabajadores!: Observable<any[]>;

  constructor(
    private dialogRef: MatDialogRef<ModalEditarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { bien: any },
    private fb: FormBuilder,
    private bienesService: BienesService,
    private trabajadoresService: TrabajadoresService
  ) { }

  ngOnInit(): void {
    // Inicializar el formulario
    this.editBienForm = this.fb.group({
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
      ubiRes: [''],
      observ1: [''],
      observ2: [''],
      comentCont: [''],
      seguimDesinc: [''],
      estatusBien: ['ALTA'],
      motBaja: [''],
      fechaBaja: [''],
      aAdquisicion: [0],
      mAdquisicion: [''],
      fotoBien: [''],
      perfilRes: [''],
      puestoRes: [''],
      estatusRes: [''],
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
      estatusResguardo: [''],
      ultimoResguardo: [''],
      etiqueta: ['NO'],
      idTrabajador: [null]
    });

    // Actualizar frecuencia de depreciación en función de 'depreciacion'
    this.editBienForm.get('depreciacion')!.valueChanges.subscribe(val => {
      if (val === 'SI') {
        this.editBienForm.patchValue({ frecDepre: 'MENSUAL' });
      } else {
        this.editBienForm.patchValue({ frecDepre: 'NO APLICA' });
      }
    });

    // Patch de los datos del bien recibido
    if (this.data && this.data.bien) {
      this.editBienForm.patchValue(this.data.bien);
      const nombre = this.data.bien.nomRes;
      const numero = this.data.bien.numRes;
      if (nombre) {
        const trabajadorObj = { nombre: nombre, numero: numero };
        this.resguardanteControl.setValue(trabajadorObj, { emitEvent: false });
      }
    }
    
    // Cargar trabajadores para el autocomplete
    this.trabajadoresService.getTrabajadores().subscribe(data => {
      this.trabajadores = data;
      this.filteredTrabajadores = this.resguardanteControl.valueChanges.pipe(
        startWith(this.resguardanteControl.value),
        map(value => this._filterTrabajadores(value))
      );
      
    });
  }

  displayFn(trabajador: any): string {
    return trabajador && trabajador.nombre ? trabajador.nombre : '';
  }
  

  private _filterTrabajadores(value: any): any[] {
    let filterValue = '';
    if (typeof value === 'string') {
      filterValue = value.toLowerCase();
    } else if (typeof value === 'object' && value && value.nombre) {
      // Si es un objeto, usamos cadena vacía para mostrar todos
      filterValue = '';
    }
    return this.trabajadores.filter(t =>
      t.nombre.toLowerCase().includes(filterValue) ||
      t.numero.toString().includes(filterValue)
    );
  }

  // Al seleccionar un trabajador del autocomplete
  seleccionarTrabajador(trabajador: any): void {
    this.editBienForm.patchValue({
      nomRes: trabajador.nombre,
      numRes: trabajador.numero,
      areaRes: trabajador.area,
      ubiRes: trabajador.ubicacion,
      perfilRes: trabajador.perfilAcad,
      puestoRes: trabajador.puesto,
      estatusRes: trabajador.estatus,
      correoPerRes: trabajador.correoPersonal,
      correoInstRes: trabajador.correoInstit,
      rfcTrabaj: trabajador.rfcTrabaj,
      idTrabajador: trabajador.idTrabajador
    });
    this.resguardanteControl.setValue(trabajador);
  }

  // Opcional: No se recomienda limpiar el valor al enfocar si quieres mantener el actual
  onFocusResguardante(): void {
    // Si deseas que al enfocar se muestre la lista completa, podrías simplemente disparar valueChanges sin modificar el valor.
    this.resguardanteControl.setValue('');
    // Pero si haces eso, se borrará el valor actual.
  }

  onSubmit(): void {
    if (this.editBienForm.valid) {
      const idBien = this.data.bien.idBien;
      this.bienesService.updateBien(idBien, this.editBienForm.value).subscribe(
        (response) => {
          console.log('Bien actualizado exitosamente', response);
          this.dialogRef.close(true);
        },
        (error) => {
          console.error('Error al actualizar el bien', error);
        }
      );
    } else {
      console.warn('Formulario inválido. Revisa los campos requeridos.');
    }
  }

  cerrarModal(): void {
    this.dialogRef.close(false);
  }
}
