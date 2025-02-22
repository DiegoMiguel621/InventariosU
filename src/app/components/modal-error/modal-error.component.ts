import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-error',
  templateUrl: './modal-error.component.html',
  styleUrls: ['./modal-error.component.css']
})
export class ModalErrorComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalErrorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mensaje: string }
  ) {}

  cerrarModal(): void {
    this.dialogRef.close();

    // Esperar un pequeño tiempo antes de devolver el foco al botón "Entrar"
    setTimeout(() => {
      const loginButton = document.getElementById('loginButton'); // ID del botón en login
      if (loginButton) {
        loginButton.focus();
      }
    }, 100);
  }
}

