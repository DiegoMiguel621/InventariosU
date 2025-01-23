import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BienesService } from '../../service/bienes.service';

@Component({
  selector: 'app-modal-eliminar',
  templateUrl: './modal-eliminar.component.html',
  styleUrls: ['./modal-eliminar.component.css']
})
export class ModalEliminarComponent {

  constructor(
    private dialogRef: MatDialogRef<ModalEliminarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { idBien: number },
    private bienesService: BienesService
  ) {}

  eliminarBien(): void {
    // Llamamos al servicio para eliminar
    this.bienesService.deleteBien(this.data.idBien).subscribe(
      (response) => {
        console.log('Bien eliminado:', response);
        // Cerramos el modal pasando un valor true 
        // para indicar al padre que se concretó la eliminación
        this.dialogRef.close(true);
      },
      (error) => {
        console.error('Error al eliminar el bien:', error);
        // Podrías mostrar un mensaje o cerrar con false
        this.dialogRef.close(false);
      }
    );
  }

  cancelar(): void {
    // Cierra el modal sin hacer cambios
    this.dialogRef.close(false);
  }
}
