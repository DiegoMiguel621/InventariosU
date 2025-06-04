// src/app/personal/modal-tipo-resguardo/modal-tipo-resguardo.component.ts
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-tipo-resguardo',
  templateUrl: './modal-tipo-resguardo.component.html',
  styleUrls: ['./modal-tipo-resguardo.component.css']
})
export class ModalTipoResguardoComponent {
  // Propiedades para bindear los checkboxes
  patrimonioSelected: boolean = false;
  sujetoControlSelected: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ModalTipoResguardoComponent>
  ) {}

  // Cierra sin devolver nada (cancelación)
  close(): void {
    this.dialogRef.close(null);
  }

  // Método que se dispara al hacer click en "EXCEL"
  onExcelClick(): void {
    // Si "PATRIMONIO" está marcado, devolvemos un flag concreto
    if (this.patrimonioSelected) {
      this.dialogRef.close('PATRIMONIO_EXCEL');
    } else {
      // Opcional: podrías mostrar un mensaje de error si no marcó nada,
      // o simplemente cerrar sin valor:
      this.dialogRef.close(null);
    }
  }

  // (Opcional en el futuro) Método para PDF
  onPdfClick(): void {
    // Harías algo similar, por ejemplo:
    // if (this.patrimonioSelected) {
    //   this.dialogRef.close('PATRIMONIO_PDF');
    // } else {
    //   this.dialogRef.close(null);
    // }
    this.dialogRef.close(null);
  }
}
