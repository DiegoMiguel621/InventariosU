import { Component } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-eliminar-personal',
  templateUrl: './modal-eliminar-personal.component.html',
  styleUrl: './modal-eliminar-personal.component.css'
})
export class ModalEliminarPersonalComponent {
  EliminarPersonalForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModalEliminarPersonalComponent>,
    private fb: FormBuilder,
  ) {
    this.EliminarPersonalForm = this.fb.group({

    });
  }

  onSubmit() {


  }
}
