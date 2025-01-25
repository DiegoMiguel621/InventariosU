import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdministradoresService } from '../service/administradores.service';


@Component({
  selector: 'app-modal-add-administrador',
  templateUrl: './modal-add-administrador.component.html',
  styleUrl: './modal-add-administrador.component.css'
})
export class ModalAddAdministradorComponent implements OnInit {
  administradorForm: FormGroup;

  constructor(
      private dialogRef: MatDialogRef<ModalAddAdministradorComponent>,
      private fb: FormBuilder, // Constructor del formulario
    private administradoresService: AdministradoresService // Servicio de administradores
    ) {
      // Inicializar el formulario con campos vacíos y validaciones
    this.administradorForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellidos: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      permiso: ['', [Validators.required]]
    });
    }

    ngOnInit(): void {}

    closeModal(): void {
      this.dialogRef.close(); // Cierra el modal sin enviar datos
    }

    // Guardar los datos del administrador
  saveAdministrador(): void {
    if (this.administradorForm.valid) {
      const administradorData = this.administradorForm.value;
      this.administradoresService.addAdministrador(administradorData).subscribe(
        (response) => {
          console.log('Administrador añadido:', response);
          this.dialogRef.close(true); // Cierra el modal y devuelve un indicador de éxito
        },
        (error) => {
          console.error('Error al añadir administrador:', error);
        }
      );
    } else {
      console.log('Formulario inválido');
    }
  }
}
