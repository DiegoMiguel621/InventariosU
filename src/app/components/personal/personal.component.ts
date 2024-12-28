import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalAgregarPersonalComponent } from '../../modal-agregar-personal/modal-agregar-personal.component';
import { ModalVerPersonalComponent } from '../../modal-ver-personal/modal-ver-personal.component';
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
      if (result) {
        // Refrescamos la lista de trabajadores al cerrar el modal
        this.trabajadoresService.getTrabajadores().subscribe((data) => {
          this.trabajadores = data;
        });
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
  
}
