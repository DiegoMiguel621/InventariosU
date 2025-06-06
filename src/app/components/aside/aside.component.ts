import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importar el Router
import { MatDialog } from '@angular/material/dialog';
import { ModalCerrarSesionComponent } from '../../modal-cerrar-sesion/modal-cerrar-sesion.component'; 
@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent {
  constructor(private router: Router, private dialog: MatDialog) {}

  abrirModalCerrarSesion(): void {
    this.dialog.open(ModalCerrarSesionComponent, {
      width: '400px',
      disableClose: true // opcional: evita cerrar al hacer clic fuera del modal
    });
  }
}
