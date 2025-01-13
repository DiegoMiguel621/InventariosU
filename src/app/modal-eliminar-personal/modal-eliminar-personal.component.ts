import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TrabajadoresService } from '../service/trabajadores.service';

@Component({
  selector: 'app-modal-eliminar-personal',
  templateUrl: './modal-eliminar-personal.component.html',
  styleUrls: ['./modal-eliminar-personal.component.css']
})
export class ModalEliminarPersonalComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalEliminarPersonalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }, // Recibimos el ID del trabajador
    private trabajadoresService: TrabajadoresService // Servicio para interactuar con la API
  ) {}

  // Función para eliminar el trabajador
  eliminarTrabajador(): void {
    this.trabajadoresService.deleteTrabajador(this.data.id).subscribe({
      next: (response) => {
        console.log('Trabajador eliminado correctamente:', response.message); // Muestra el mensaje devuelto por el backend
        this.dialogRef.close(true); // Cierra el modal con éxito
      },
      error: (error) => {
        console.error('Error al eliminar el trabajador:', error);
        this.dialogRef.close(false); // Cierra el modal con fallo
      }
    });
  }
  
  
  

  cancelar(): void {
    this.dialogRef.close(); // Cierra el modal sin realizar ninguna acción
  }
  
}
