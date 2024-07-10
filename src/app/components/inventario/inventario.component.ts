import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalforminvComponent } from '../modalforminv/modalforminv.component';


@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent{



  constructor(private _matDialog: MatDialog){}
  abrirModal():void{
    this._matDialog.open(ModalforminvComponent),{

    }

  }


}

