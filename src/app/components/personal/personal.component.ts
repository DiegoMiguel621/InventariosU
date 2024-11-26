import { Component, OnInit } from '@angular/core';

import { ApiBienesService } from '../../service/api-bienes.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalAgregarPersonalComponent } from '../../modal-agregar-personal/modal-agregar-personal.component';
import { ModalVerPersonalComponent } from '../../modal-ver-personal/modal-ver-personal.component';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrl: './personal.component.css'
})
export class PersonalComponent implements OnInit{


    bienes: any[] = [];

    constructor(private _matDialog: MatDialog, private apiBienesService: ApiBienesService) {}

    ngOnInit(): void {
      this.apiBienesService.getBienes().subscribe(data => {
        this.bienes = data;
      });
    }

    agregarPersonal(): void {
      const dialogRef = this._matDialog.open(ModalAgregarPersonalComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.apiBienesService.getBienes().subscribe(data => {
            this.bienes = data;
          });
        }
      });
    }


    verrPersonal(): void {
      const dialogRef = this._matDialog.open(ModalVerPersonalComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.apiBienesService.getBienes().subscribe(data => {
            this.bienes = data;
          });
        }
      });
    }

  }
