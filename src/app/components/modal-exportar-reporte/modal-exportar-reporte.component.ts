import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-exportar-reporte',
  templateUrl: './modal-exportar-reporte.component.html',
  styleUrls: ['./modal-exportar-reporte.component.css']
})
export class ModalExportarReporteComponent {
  exportPdf = false;
  exportExcel = false;

  constructor(private dialogRef: MatDialogRef<ModalExportarReporteComponent>) {}

  aceptar() {
    const seleccion: string[] = [];
    if (this.exportPdf)  seleccion.push('PDF');
    if (this.exportExcel) seleccion.push('Excel');
    // Si no hay ninguno, devolvemos null para tratarlo como "cancelar"
    this.dialogRef.close(seleccion.length ? seleccion : null);
  }

  cancelar() {
    this.dialogRef.close(null);
  }
  /** Cierra el modal sin devolver ningún formato */
close(): void {
  this.dialogRef.close(null);
}

}
