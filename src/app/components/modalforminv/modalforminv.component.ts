// src/app/components/modalforminv/modalforminv.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BienesService } from '../../service/bienes.service';

@Component({
  selector: 'app-modalforminv',
  templateUrl: './modalforminv.component.html',
  styleUrls: ['./modalforminv.component.css']
})
export class ModalforminvComponent {

  addProductForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModalforminvComponent>,
    private fb: FormBuilder,
    private bienesService: BienesService
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
          etiqueta: ['NO']
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
  }

  
  onSubmit() {
    if (this.addProductForm.valid) {
      this.bienesService.addBien(this.addProductForm.value).subscribe(
        response => {
          console.log('Bien agregado exitosamente', response);
          // Cerramos el modal y retornamos un valor true
          this.dialogRef.close(true);
        },
        error => {
          console.error('Error al agregar el bien', error);
        }
      );
    } else {
      console.warn('Formulario inválido. Revisa los campos requeridos.');
    }
  }
  

  cerrarModal(): void {
    this.dialogRef.close();
    console.log('Modal de agregar bien cerrado');
  }
}
