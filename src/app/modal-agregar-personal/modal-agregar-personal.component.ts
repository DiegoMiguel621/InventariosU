import { Component } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-modal-agregar-personal',
  templateUrl: './modal-agregar-personal.component.html',
  styleUrl: './modal-agregar-personal.component.css'
})
export class ModalAgregarPersonalComponent {

  addPersonalForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModalAgregarPersonalComponent>,
    private fb: FormBuilder,
  ) {
    this.addPersonalForm = this.fb.group({
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


  }



}
