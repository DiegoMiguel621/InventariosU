import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-eliminar-administrador',
  templateUrl: './modal-eliminar-administrador.component.html',
  styleUrl: './modal-eliminar-administrador.component.css'
})
export class ModalEliminarAdministradorComponent implements OnInit {

  constructor(
        private dialogRef: MatDialogRef<ModalEliminarAdministradorComponent>,
        private fb: FormBuilder, // Constructor del formulario
        private dialog: MatDialog
      ) {}


ngOnInit(): void{}

}
