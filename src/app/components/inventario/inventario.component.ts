import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalforminvComponent } from '../modalforminv/modalforminv.component';
import { ModalEditarComponent } from '../modal-editar/modal-editar.component';
import { ModalVerComponent } from '../modal-ver/modal-ver.component';
import { ModalEliminarComponent } from '../modal-eliminar/modal-eliminar.component';
import { BienesService } from '../../service/bienes.service'; // Importamos el servicio de bienes

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  bienes: any[] = [];

  constructor(private _matDialog: MatDialog, private bienesService: BienesService) {}

  ngOnInit(): void {
    // Obtener los bienes y mostrarlos en la tabla
    this.bienesService.getBienes().subscribe(data => {
      this.bienes = data;
    });
  }

  // Abrir el modal para agregar un bien
  agregarBien(): void {
    this._matDialog.open(ModalforminvComponent).afterClosed().subscribe(() => {
      console.log('Modal de agregar bien cerrado');
    });
  }

  // Abrir el modal para editar un bien
  editarBien(bien: any): void {
    this._matDialog.open(ModalEditarComponent, {
      data: bien
    }).afterClosed().subscribe(() => {
      console.log('Modal de editar bien cerrado');
    });
  }

  // Abrir el modal para ver los detalles de un bien
  VerBien(bien: any): void {
    this._matDialog.open(ModalVerComponent, {
      data: bien
    }).afterClosed().subscribe(() => {
      console.log('Modal de ver bien cerrado');
    });
  }

  // Abrir el modal para eliminar un bien
  eliminarBien(id: number): void {
    this._matDialog.open(ModalEliminarComponent, {
      data: { id: id }
    }).afterClosed().subscribe(() => {
      console.log('Modal de eliminar bien cerrado');
    });
  }
}
