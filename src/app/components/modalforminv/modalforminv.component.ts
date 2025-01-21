// src/app/components/modalforminv/modalforminv.component.ts
import { Component } from '@angular/core';
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
      // 1
      numInvAnt: [''],
      // 2
      numInvArm: [''],
      // 3
      cControl: [''],
      // 4
      nombreBien: ['', Validators.required],
      // 5
      clasificacion: [''],
      // 6
      clasAdic: [''],
      // 7
      nombreCat: [''],
      // 8
      descripcion: [''],
      // 9
      marca: [''],
      // 10
      modelo: [''],
      // 11
      numSerie: [''],
      // 12
      aplicaRegCont: ['NO'],
      // 13
      grupoBienesCont: [''],
      // 14
      grupoBienesConac: [''],
      // 15
      categoria: [''],
      // 16
      subcategoria: [''],
      // 17
      tipoAlta: ['OTRO'],
      // 18
      facturaFisica: ['NO'],
      // 19
      fechaRecFact: [''],
      // 20
      numFact: [''],
      // 21
      fechaFact: [''],
      // 22
      fechaAlta: [''],
      // 23
      costoAdq: [0],
      // 24
      costoAdqCont: [0],
      // 25
      depreciacion: ['NO'],
      // 26
      frecDepre: [''],
      // 27
      porcDepAnual: [0],
      // 28
      mesesDepre: [0],
      // 29
      impMensDepre: [0],
      // 30
      montoDepre: [0],
      // 31
      valLibros: [0],
      // 32
      mesesPendDepre: [0],
      // 33
      claveProyecto: [''],
      // 34
      apProye: ['NO'], // enum SI/NO
      // 35
      partPres: [''],
      // 36
      fuenteFinan: [''],
      // 37
      numCuenta: [''],
      // 38
      proveedor: [''],
      // 39
      rfcProveedor: [''],
      // 40
      domProveedor: [''],
      // 41
      bienesMenores: [0],
      // 42
      tipoResguardo: [''],
      // 43
      nomRes: [''],
      // 44
      numRes: [0],
      // 45
      areaRes: [''],
      // 46
      ubiRes: [''],
      // 47
      observ1: [''],
      // 48
      observ2: [''],
      // 49
      comentCont: [''],
      // 50
      seguimDesinc: [''],
      // 51
      estatusBien: ['ALTA'], // o 'BAJA', etc.
      // 52
      motBaja: [''],
      // 53
      fechaBaja: [''],
      // 54
      aAdquisicion: [2025],
      // 55
      mAdquisicion: ['ENERO'],
      // 56
      fotoBien: [''],
      // 57
      perfilRes: [''],
      // 58
      puestoRes: [''],
      // 59
      estatusRes: [''],
      // 60
      correoPerRes: [''],
      // 61
      correoInstRes: [''],
      // 62
      res16Ant: ['NO'],
      // 63
      res17: ['NO'],
      // 64
      res18: ['NO'],
      // 65
      res19: ['NO'],
      // 66
      res20: ['NO'],
      // 67
      res21: ['NO'],
      // 68
      res22: ['NO'],
      // 69
      res23: ['NO'],
      // 70
      res24: ['NO'],
      // 71
      estatusResguardo: [''],
      // 72
      ultimoResguardo: [''],
      // 73
      etiqueta: ['NO']
    });
  }

  onSubmit() {
    if (this.addProductForm.valid) {
      this.bienesService.addBien(this.addProductForm.value).subscribe(
        response => {
          console.log('Bien agregado exitosamente', response);
          this.dialogRef.close();
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
