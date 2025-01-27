import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdministradoresService } from '../service/administradores.service';

@Component({
  selector: 'app-modal-editar-administrador',
  templateUrl: './modal-editar-administrador.component.html',
  styleUrl: './modal-editar-administrador.component.css'
})
export class ModalEditarAdministradorComponent implements OnInit {


  constructor(
    private dialogRef: MatDialogRef<ModalEditarAdministradorComponent>,
    private fb: FormBuilder, // Constructor del formulario
    private administradoresService: AdministradoresService, // Servicio de administradores
    private dialog: MatDialog
  ) {}

  ngOnInit(): void{}

}
