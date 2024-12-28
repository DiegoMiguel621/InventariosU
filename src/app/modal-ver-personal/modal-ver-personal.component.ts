import { Component, Inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrabajadoresService } from '../service/trabajadores.service';



@Component({
  selector: 'app-modal-ver-personal',
  templateUrl: './modal-ver-personal.component.html',
  styleUrl: './modal-ver-personal.component.css'
})
export class ModalVerPersonalComponent implements OnInit {
  trabajador: any = null; // Almacena los datos del trabajador

  constructor(
    private trabajadoresService: TrabajadoresService,
    public dialogRef: MatDialogRef<ModalVerPersonalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number } // Recibimos el ID
  ) {}

  ngOnInit(): void {
    // Obtenemos los datos del trabajador
    this.trabajadoresService.getTrabajadorById(this.data.id).subscribe(
      (data) => {
        this.trabajador = data; // Asignamos los datos
      },
      (error) => {
        console.error('Error al obtener los datos del trabajador:', error);
      }
    );
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
