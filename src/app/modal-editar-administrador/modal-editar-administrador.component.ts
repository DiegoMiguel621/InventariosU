import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdministradoresService } from '../service/administradores.service';

@Component({
  selector: 'app-modal-editar-administrador',
  templateUrl: './modal-editar-administrador.component.html',
  styleUrls: ['./modal-editar-administrador.component.css']
})
export class ModalEditarAdministradorComponent implements OnInit {
  administradorForm!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<ModalEditarAdministradorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // Recibe los datos del administrador
    private fb: FormBuilder,
    private administradoresService: AdministradoresService
  ) {
    console.log('Datos recibidos en el modal:', data);
  }
  

  ngOnInit(): void {
    this.administradorForm = this.fb.group({
      nombres: [this.data.nombres, [Validators.required, Validators.minLength(3)]],
      apellidos: [this.data.apellidos, [Validators.required]],
      correo: [this.data.correo, [Validators.required, Validators.email]],
      contraseña: [this.data.contraseña, [Validators.required]],
      permiso: [this.data.permiso, [Validators.required]]
    });
  }
  

  cerrar(): void {
    this.dialogRef.close(false); // Cierra el modal sin realizar cambios
  }

  guardar(): void {
    if (this.administradorForm.valid) {
      const administradorData = this.administradorForm.value;
      this.administradoresService.updateAdministrador(this.data.id_administrador, administradorData).subscribe({
        next: (response) => {
          console.log('Administrador actualizado correctamente:', response);
          this.dialogRef.close(true); // Cierra el modal y notifica éxito
        },
        error: (error) => {
          console.error('Error al actualizar el administrador:', error);
        }
      });
    } else {
      console.log('Formulario inválido');
    }
  }
}
