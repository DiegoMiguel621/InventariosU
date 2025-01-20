import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiBienesService } from '../../service/api-bienes.service';

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
    private apiBienesService: ApiBienesService
  ) {
    this.addProductForm = this.fb.group({
      clave: ['', Validators.required],
      nombre: ['', Validators.required],
      marca: [''],
      modelo: [''],
      numSerie: [''],
      encargado: [''],
      observaciones: ['']
    });
  }

  onSubmit() {
    if (this.addProductForm.valid) {
      this.apiBienesService.addBien(this.addProductForm.value).subscribe(
        response => {
          console.log('Producto agregado exitosamente', response);
          this.dialogRef.close();
        },
        error => {
          console.error('Error al agregar el producto', error);
          // Mostrar mensaje al usuario sobre el error
        }
      );
    }
  }
  cerrarModal(): void {
    this.dialogRef.close();
    console.log('Modal de agregar bien cerrado');
  }
}
