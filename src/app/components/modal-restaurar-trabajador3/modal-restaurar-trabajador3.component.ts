import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TrabajadoresService } from '../../service/trabajadores.service';

@Component({
  selector: 'app-modal-restaurar-trabajador3',
  templateUrl: './modal-restaurar-trabajador3.component.html',
  styleUrl: './modal-restaurar-trabajador3.component.css'
})
export class ModalRestaurarTrabajador3Component {
  constructor(
    public dialogRef: MatDialogRef<ModalRestaurarTrabajador3Component>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }, // Recibimos el ID del trabajador
    private trabajadoresService: TrabajadoresService // Servicio para interactuar con la API
  ) {}

 // Función para eliminar el trabajador
 restaurarTrabajador(): void {
  this.trabajadoresService.restoreTrabajador(this.data.id).subscribe({
    next: (response) => {
      console.log('Trabajador restaurado:', response);
      // Cerramos el modal con true para indicar éxito
      this.dialogRef.close(true);
    },
    error: (error) => {
      console.error('Error al restaurar:', error);
      // Cerrar con false para indicar fallo
      this.dialogRef.close(false);
    }
  });
}

  cancelar(): void {
    this.dialogRef.close(); // Cierra el modal sin realizar ninguna acción
  }

}
