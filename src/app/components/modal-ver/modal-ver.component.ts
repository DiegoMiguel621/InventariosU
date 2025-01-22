import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BienesService } from '../../service/bienes.service';

@Component({
  selector: 'app-modal-ver',
  templateUrl: './modal-ver.component.html',
  styleUrls: ['./modal-ver.component.css']
})
export class ModalVerComponent implements OnInit {
  bien: any;

  constructor(
    private dialogRef: MatDialogRef<ModalVerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { idBien: number },
    private bienesService: BienesService
  ) {}

  ngOnInit(): void {
    console.log('ID recibido en el modal:', this.data.idBien);

    if (this.data && this.data.idBien) {
      this.bienesService.getBien(this.data.idBien).subscribe(
        (response) => {
          console.log('Respuesta de la API:', response);
          this.bien = response; // Almacena el objeto con todos los campos
        },
        (error) => {
          console.error('Error al obtener el bien:', error);
        }
      );
    }
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }
}
