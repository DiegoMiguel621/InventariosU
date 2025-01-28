import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdministradoresService } from '../service/administradores.service';

@Component({
  selector: 'app-modal-filtros-bienes',
  templateUrl: './modal-filtros-bienes.component.html',
  styleUrl: './modal-filtros-bienes.component.css'
})
export class ModalFiltrosBienesComponent implements OnInit{

  constructor(
    private dialogRef: MatDialogRef<ModalFiltrosBienesComponent>,
    private fb: FormBuilder, // Constructor del formulario
    private administradoresService: AdministradoresService, // Servicio de administradores
    private dialog: MatDialog
  ) {


  }



  ngOnInit(): void{}


}
