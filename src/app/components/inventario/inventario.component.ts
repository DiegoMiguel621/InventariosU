import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalforminvComponent } from '../modalforminv/modalforminv.component';
import { ModalEditarComponent } from '../modal-editar/modal-editar.component';
import { ModalVerComponent } from '../modal-ver/modal-ver.component';
import { ModalEliminarComponent } from '../modal-eliminar/modal-eliminar.component';


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
  abrirModal2():void{
    this._matDialog.open(ModalEditarComponent),{

    }

}

  abrirModal3():void{
    this._matDialog.open(ModalVerComponent),{

    }
}

abrirModal4():void{
  this._matDialog.open(ModalEliminarComponent),{

  }
}
}
