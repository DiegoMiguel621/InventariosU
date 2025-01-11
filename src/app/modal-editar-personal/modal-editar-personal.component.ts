import { Component, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-editar-personal',
  templateUrl: './modal-editar-personal.component.html',
  styleUrl: './modal-editar-personal.component.css'
})
export class ModalEditarPersonalComponent {

  EditarPersonalForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModalEditarPersonalComponent>,
    private fb: FormBuilder,
  ) {
    this.EditarPersonalForm = this.fb.group({

    });
  }

  onSubmit() {


  }

}
