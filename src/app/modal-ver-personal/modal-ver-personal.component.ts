import { Component } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-modal-ver-personal',
  templateUrl: './modal-ver-personal.component.html',
  styleUrl: './modal-ver-personal.component.css'
})
export class ModalVerPersonalComponent {
  verPersonalForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModalVerPersonalComponent>,
    private fb: FormBuilder,
  ) {
    this.verPersonalForm = this.fb.group({

    });
  }

  onSubmit() {


  }
}
