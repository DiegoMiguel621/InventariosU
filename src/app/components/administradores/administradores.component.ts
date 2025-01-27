import { Component, OnInit } from '@angular/core';
import { AdministradoresService } from '../../service/administradores.service';
import { ModalAddAdministradorComponent } from '../../modal-add-administrador/modal-add-administrador.component';
import { ModalEliminarAdministradorComponent } from '../../modal-eliminar-administrador/modal-eliminar-administrador.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-administradores',
  templateUrl: './administradores.component.html',
  styleUrls: ['./administradores.component.css']
})
export class AdministradoresComponent implements OnInit {
  administradores: any[] = []; // Lista de administradores

  constructor(private _matDialog: MatDialog, private administradoresService: AdministradoresService) {}

  ngOnInit(): void {
    this.getAdministradores(); // Cargar administradores al iniciar el componente
  }

  // Obtener la lista de administradores desde el servicio
  getAdministradores(): void {
    this.administradoresService.getAdministradores().subscribe(
      (data) => {
        this.administradores = data; // Guardar los datos en la variable
      },
      (error) => {
        console.error('Error al obtener administradores:', error);
      }
    );
  }

  // Abrir el modal para agregar un administrador
  agregarAdministrador(): void {
    const dialogRef = this._matDialog.open(ModalAddAdministradorComponent);

    // Suscribirse al cierre del modal
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Si el modal se cerró con éxito (resultado "true"), actualiza la tabla
        this.getAdministradores();
      }
    });
  }


  eliminarAdministrador(): void {
    const dialogRef = this._matDialog.open(ModalEliminarAdministradorComponent);
    dialogRef.afterClosed().subscribe( {
    });
  }
}
