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
    // Sólo Patrimonio:
    if (this.patrimonioSelected && !this.sujetoControlSelected) {
      this.dialogRef.close('PATRIMONIO_EXCEL');
      return;
    }

    // Sólo Sujeto a Control:
    if (!this.patrimonioSelected && this.sujetoControlSelected) {
      this.dialogRef.close('SUJETO_CONTROL_EXCEL');
      return;
    }

    // Ambas marcadas: devolvemos un arreglo con los dos flags
    if (this.patrimonioSelected && this.sujetoControlSelected) {
      this.dialogRef.close([
        'PATRIMONIO_EXCEL',
        'SUJETO_CONTROL_EXCEL'
      ]);
      return;
    }

    // Si no marcó nada, cerramos sin valor
    this.dialogRef.close(null);
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
