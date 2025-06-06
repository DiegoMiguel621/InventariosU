// src/app/shared/modal-cerrar-sesion/modal-cerrar-sesion.component.ts
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-cerrar-sesion',
  templateUrl: './modal-cerrar-sesion.component.html',
  styleUrls: ['./modal-cerrar-sesion.component.css']
})
export class ModalCerrarSesionComponent {
  constructor(
    private dialogRef: MatDialogRef<ModalCerrarSesionComponent>,
    private router: Router
  ) {}

  /** Método que se invoca si el usuario hace clic en “Cerrar” dentro del modal */
  confirmarCerrar(): void {
    // 1) Eliminar datos del localStorage
    localStorage.removeItem('admin');

    // 2) Cerrar el diálogo
    this.dialogRef.close();

    // 3) Redirigir al login
    this.router.navigate(['/login']);
  }

  /** Método que se invoca si el usuario hace clic en “Cancelar” */
  cancelar(): void {
    this.dialogRef.close();
  }
}
