import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { AdministradoresService } from '../service/administradores.service';

@Component({
  selector: 'app-modal-filtros-bienes',
  templateUrl: './modal-filtros-bienes.component.html',
  styleUrls: ['./modal-filtros-bienes.component.css']
})
export class ModalFiltrosBienesComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ModalFiltrosBienesComponent>,
    private fb: FormBuilder,
    private administradoresService: AdministradoresService
  ) {}

  ngOnInit(): void {
    // Carga inicial de datos si lo requieres
  }

  // Llamado para cerrar este modal
  closeModal(): void {
    this.dialogRef.close();
  }

}
