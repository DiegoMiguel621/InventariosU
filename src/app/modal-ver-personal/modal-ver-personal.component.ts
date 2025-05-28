import { Component, Inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrabajadoresService } from '../service/trabajadores.service';
import { BienesService } from '../service/bienes.service';

@Component({
  selector: 'app-modal-ver-personal',
  templateUrl: './modal-ver-personal.component.html',
  styleUrl: './modal-ver-personal.component.css'
})
export class ModalVerPersonalComponent implements OnInit {
  trabajador: any = null; // Almacena los datos del trabajador
  bienesAsignados: any[] = [];  // lista de bienes

  constructor(
    private trabajadoresService: TrabajadoresService,
    private bienesService: BienesService, 
    public dialogRef: MatDialogRef<ModalVerPersonalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number } // Recibimos el ID
  ) {}

  ngOnInit(): void {
    // Obtenemos los datos del trabajador
    this.trabajadoresService.getTrabajadorById(this.data.id).subscribe(
      (data) => {
        this.trabajador = data; // Asignamos los datos
        this.cargarBienesAsignados();
      },
      (error) => {
        console.error('Error al obtener los datos del trabajador:', error);
      }
    );
  }

  private cargarBienesAsignados(): void {
  this.bienesService.getBienes()
    .subscribe(bienes => {
      const nombreTrab = (this.trabajador.nombre || '')
        .trim()
        .toLowerCase();

      this.bienesAsignados = bienes.filter(b => {
        const nomRes = (b.nomRes || '')
          .trim()
          .toLowerCase();
        return nomRes === nombreTrab;
      });

      console.log('Comparando:', nombreTrab, 'contra lista de nomRes:', 
                  bienes.map(b => (b.nomRes||'').trim().toLowerCase()));
    });
}


  closeModal(): void {
    this.dialogRef.close();
  }
}
