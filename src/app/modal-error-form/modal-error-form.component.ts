import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-error-form',
  templateUrl: './modal-error-form.component.html',
  styleUrls: ['./modal-error-form.component.css']
})
export class ModalErrorFormComponent {
  constructor(private dialogRef: MatDialogRef<ModalErrorFormComponent>) {}

  cerrarModal() {
    this.dialogRef.close();
  }
}
