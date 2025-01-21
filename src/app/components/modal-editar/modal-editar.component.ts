import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-editar',
  templateUrl: './modal-editar.component.html',
  styleUrls: ['./modal-editar.component.css']
})
export class ModalEditarComponent {

  constructor(
    private dialogRef: MatDialogRef<ModalEditarComponent>
  ) { }

  cerrarModal(): void {
    this.dialogRef.close();
  }
}

