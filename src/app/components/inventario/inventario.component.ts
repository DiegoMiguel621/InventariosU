import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalforminvComponent } from '../modalforminv/modalforminv.component';
import { ModalEditarComponent } from '../modal-editar/modal-editar.component';
import { ModalVerComponent } from '../modal-ver/modal-ver.component';
import { ModalEliminarComponent } from '../modal-eliminar/modal-eliminar.component';
import { ApiBienesService } from '../../service/api-bienes.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent implements OnInit {
  bienes: any[] = [];

  constructor(private _matDialog: MatDialog, private apiBienesService: ApiBienesService) {}

  ngOnInit(): void {
    this.apiBienesService.getBienes().subscribe(data => {
      this.bienes = data;
    });
  }

  abrirModal(): void {
    const dialogRef = this._matDialog.open(ModalforminvComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiBienesService.getBienes().subscribe(data => {
          this.bienes = data;
        });
      }
    });
  }

  editarBien(bien: any): void {
    const dialogRef = this._matDialog.open(ModalEditarComponent, {
      data: bien
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiBienesService.getBienes().subscribe(data => {
          this.bienes = data;
        });
      }
    });
  }

  abrirModalVer(bien: any): void {
    this._matDialog.open(ModalVerComponent, {
      data: bien
    });
  }

  eliminarBien(id: number): void {
    const dialogRef = this._matDialog.open(ModalEliminarComponent, {
      data: { id: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiBienesService.deleteBien(id).subscribe(() => {
          this.apiBienesService.getBienes().subscribe(data => {
            this.bienes = data;
          });
        });
      }
    });
  }
}
