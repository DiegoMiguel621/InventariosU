import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-modalforminv',
  templateUrl: './modalforminv.component.html',
  styleUrl: './modalforminv.component.css'
})
export class ModalforminvComponent {

  constructor(public _matDialogRef: MatDialogRef<ModalforminvComponent>){

  }



}
