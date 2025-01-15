import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalAgregarPersonalComponent } from '../../modal-agregar-personal/modal-agregar-personal.component';
import { ModalVerPersonalComponent } from '../../modal-ver-personal/modal-ver-personal.component';
import { ModalEditarPersonalComponent } from '../../modal-editar-personal/modal-editar-personal.component';
import { ModalEliminarPersonalComponent } from '../../modal-eliminar-personal/modal-eliminar-personal.component';
import { TrabajadoresService } from '../../service/trabajadores.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css'],
})
export class PersonalComponent implements OnInit {
  trabajadores: any[] = [];
  paginatedTrabajadores: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;

  Math = Math; // Exponemos el objeto Math al template

  constructor(
    private _matDialog: MatDialog,
    private trabajadoresService: TrabajadoresService
  ) {}

  ngOnInit(): void {
    this.trabajadoresService.getTrabajadores().subscribe((data) => {
      this.trabajadores = data;
      this.updatePagination();
    });
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedTrabajadores = this.trabajadores.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.trabajadores.length) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  agregarPersonal(): void {
    const dialogRef = this._matDialog.open(ModalAgregarPersonalComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.trabajadoresService.getTrabajadores().subscribe((data) => {
          this.trabajadores = data;
          this.updatePagination();
        });
      }
    });
  }

  verrPersonal(id: number): void {
    const dialogRef = this._matDialog.open(ModalVerPersonalComponent, {
      data: { id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.trabajadoresService.getTrabajadores().subscribe((data) => {
          this.trabajadores = data;
          this.updatePagination();
        });
      }
    });
  }

  editarPersonal(trabajador: any): void {
    const dialogRef = this._matDialog.open(ModalEditarPersonalComponent, {
      data: trabajador,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.trabajadoresService.getTrabajadores().subscribe((data) => {
          this.trabajadores = data;
          this.updatePagination();
        });
      }
    });
  }

  eliminarPersonal(id: number): void {
    const dialogRef = this._matDialog.open(ModalEliminarPersonalComponent, {
      data: { id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.trabajadoresService.getTrabajadores().subscribe((data) => {
          this.trabajadores = data;
          this.updatePagination();
        });
      }
    });
  }
}

