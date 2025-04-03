import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-filtros-bienes',
  templateUrl: './modal-filtros-bienes.component.html',
  styleUrls: ['./modal-filtros-bienes.component.css']
})
export class ModalFiltrosBienesComponent implements OnInit {
  patrimonio: boolean = false;
  sujetoControl: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ModalFiltrosBienesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    // Si el padre nos manda un estado actual, lo cargamos
    if (this.data) {
      this.patrimonio = !!this.data.patrimonio;
      this.sujetoControl = !!this.data.sujetoControl;
    }
  }

  limpiarFiltros(): void {
    this.patrimonio = false;
    this.sujetoControl = false;
  }

  verResultados(): void {
    const noFiltroMarcado = !this.patrimonio && !this.sujetoControl;
    if (noFiltroMarcado) {
      this.dialogRef.close({ mostrarTodos: true });
    } else {
      this.dialogRef.close({
        patrimonio: this.patrimonio,
        sujetoControl: this.sujetoControl
      });
    }
  }
}
