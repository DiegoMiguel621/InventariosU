import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdministradoresService } from '../service/administradores.service';

@Component({
  selector: 'app-modal-eliminar-administrador',
  templateUrl: './modal-eliminar-administrador.component.html',
  styleUrls: ['./modal-eliminar-administrador.component.css']
})
export class ModalEliminarAdministradorComponent {
  constructor(
    private dialogRef: MatDialogRef<ModalEliminarAdministradorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }, // Recibe el ID del administrador
    private administradoresService: AdministradoresService // Servicio para eliminar
  ) {}

  cancelar(): void {
    this.dialogRef.close(); // Cierra el modal sin realizar ninguna acción
  }

  eliminar(): void {
    this.administradoresService.deleteAdministrador(this.data.id).subscribe({
      next: (response) => {
        console.log('Administrador eliminado:', response);
        this.dialogRef.close(true); // Cierra el modal y notifica al componente principal
      },
      error: (error) => {
        console.error('Error al eliminar el administrador:', error);
      }
    });
  }
}
