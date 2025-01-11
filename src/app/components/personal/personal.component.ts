import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalAgregarPersonalComponent } from '../../modal-agregar-personal/modal-agregar-personal.component';
import { ModalVerPersonalComponent } from '../../modal-ver-personal/modal-ver-personal.component';
import { ModalEditarPersonalComponent } from '../../modal-editar-personal/modal-editar-personal.component';
import { ModalEliminarPersonalComponent } from '../../modal-eliminar-personal/modal-eliminar-personal.component';

import { TrabajadoresService } from '../../service/trabajadores.service'; // Importamos el nuevo servicio

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css'],
})
export class PersonalComponent implements OnInit {
  trabajadores: any[] = []; // Cambiamos 'bienes' por 'trabajadores'

  constructor(
    private _matDialog: MatDialog,
    private trabajadoresService: TrabajadoresService // Inyectamos el nuevo servicio
  ) {}

  ngOnInit(): void {
    // Usamos el servicio TrabajadoresService para obtener los datos de la API
    this.trabajadoresService.getTrabajadores().subscribe((data) => {
      this.trabajadores = data;
    });
  }

  agregarPersonal(): void {
    const dialogRef = this._matDialog.open(ModalAgregarPersonalComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        // Refrescamos la lista de trabajadores al cerrar el modal exitosamente
        this.trabajadoresService.getTrabajadores().subscribe((data) => {
          this.trabajadores = data;
        });
      } else if (result === 'error') {
        console.error('Ocurrió un error al agregar el trabajador.');
      } else {
        console.log('El modal fue cerrado sin agregar un trabajador.');
      }
    });
  }



  verrPersonal(id: number): void {
    const dialogRef = this._matDialog.open(ModalVerPersonalComponent, {
      data: { id }, // Pasamos el ID al modal
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Refrescamos la lista de trabajadores al cerrar el modal
        this.trabajadoresService.getTrabajadores().subscribe((data) => {
          this.trabajadores = data;
        });
      }
    });
  }


  editarPersonal(): void {
    const dialogRef = this._matDialog.open(ModalEditarPersonalComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.trabajadoresService.getTrabajadores().subscribe(data => {
          this.trabajadores = data;
        });
      }
    });
  }


  eliminarPersonal(): void {
    const dialogRef = this._matDialog.open(ModalEliminarPersonalComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.trabajadoresService.getTrabajadores().subscribe(data => {
          this.trabajadores = data;
        });
      }
    });
  }

}




