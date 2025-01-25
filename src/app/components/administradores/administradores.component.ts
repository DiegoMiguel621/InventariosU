import { Component, OnInit } from '@angular/core';
import { AdministradoresService } from '../../service/administradores.service';
import { ModalAddAdministradorComponent } from '../../modal-add-administrador/modal-add-administrador.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-administradores',
  templateUrl: './administradores.component.html',
  styleUrls: ['./administradores.component.css']
})
export class AdministradoresComponent implements OnInit {
  administradores: any[] = []; // Lista de administradores

  constructor(private _matDialog: MatDialog, private administradoresService: AdministradoresService) {}

  agregarAdministrador(): void {
    const dialogRef = this._matDialog.open(ModalAddAdministradorComponent,);
    dialogRef.afterClosed().subscribe( {
    });
  }


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
}
