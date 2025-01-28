import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BienesService } from '../../service/bienes.service';

@Component({
  selector: 'app-modal-editar',
  templateUrl: './modal-editar.component.html',
  styleUrls: ['./modal-editar.component.css']
})
export class ModalEditarComponent implements OnInit {
  editBienForm!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<ModalEditarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { bien: any },
    private fb: FormBuilder,
    private bienesService: BienesService
  ) { }

  ngOnInit(): void {
    // Inicializar el form
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
      etiqueta: ['NO']
    });

    this.editBienForm.get('depreciacion')!.valueChanges.subscribe(val => {
      if (val === 'SI') {
        this.editBienForm.patchValue({ frecDepre: 'MENSUAL' });
      } else {
        this.editBienForm.patchValue({ frecDepre: 'NO APLICA' });
      }
    });                

    // Patch values con el bien que recibimos
    if (this.data && this.data.bien) {
      // Rellena el form con los valores existentes del bien
      this.editBienForm.patchValue(this.data.bien);
    }
    
  }
  
  onSubmit(): void {
    if (this.editBienForm.valid) {
      const idBien = this.data.bien.idBien; // ID del bien
      // Llamamos a updateBien y pasamos el form
      this.bienesService.updateBien(idBien, this.editBienForm.value).subscribe(
        (response) => {
          console.log('Bien actualizado exitosamente', response);
          // Cerramos el modal retornando true para recargar la tabla
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
