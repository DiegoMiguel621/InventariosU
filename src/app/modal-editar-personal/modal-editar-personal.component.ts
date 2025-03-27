import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TrabajadoresService } from '../service/trabajadores.service';

@Component({
  selector: 'app-modal-editar-personal',
  templateUrl: './modal-editar-personal.component.html',
  styleUrls: ['./modal-editar-personal.component.css']
})
export class ModalEditarPersonalComponent implements OnInit {
  EditarPersonalForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModalEditarPersonalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // Recibe los datos del trabajador
    private fb: FormBuilder,
    private trabajadoresService: TrabajadoresService
  ) {}

  ngOnInit(): void {
    console.log('Datos recibidos en el modal:', this.data); // Verifica que el id esté presente
    this.EditarPersonalForm = this.fb.group({
      nombre: [this.data.nombre, [Validators.required]],
      numero: [this.data.numero, [Validators.required, Validators.pattern('^[0-9]+$')]],
      area: [this.data.area, [Validators.required]],
      ubicacion: [this.data.ubicacion, [Validators.required]],
      perfilAcad: [this.data.perfilAcad, [Validators.required]],
      puesto: [this.data.puesto, [Validators.required]],
      estatus: [this.data.estatus, [Validators.required]],
      correoPersonal: [this.data.correoPersonal, [Validators.required, Validators.email]],
      correoInstit: [this.data.correoInstit, [Validators.required, Validators.email]],
      rfcTrabaj: [this.data.rfcTrabaj, [Validators.required]]
    });
  }
  

  onSubmit(): void {
    if (this.EditarPersonalForm.valid) {
      const trabajadorEditado = this.EditarPersonalForm.value;
  
      console.log('ID del trabajador a actualizar:', this.data.idTrabajador); // Verifica el ID correcto
      console.log('Datos del trabajador editado:', trabajadorEditado);
  
      this.trabajadoresService.updateTrabajador(this.data.idTrabajador, trabajadorEditado).subscribe({
        next: (response) => {
          console.log('Trabajador actualizado correctamente:', response);
          this.dialogRef.close(true); // Indica éxito al componente padre
        },
        error: (error) => {
          console.error('Error al actualizar el trabajador:', error);
        },
      });
    } else {
      console.error('Formulario inválido');
    }
  }
  
  

  closeModal(): void {
    this.dialogRef.close(false); // Indica que se canceló la edición
  }
}
