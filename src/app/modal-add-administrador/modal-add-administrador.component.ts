import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdministradoresService } from '../service/administradores.service';


@Component({
  selector: 'app-modal-add-administrador',
  templateUrl: './modal-add-administrador.component.html',
  styleUrl: './modal-add-administrador.component.css'
})
export class ModalAddAdministradorComponent implements OnInit {
  administradorForm!: FormGroup;

  constructor(
      private dialogRef: MatDialogRef<ModalAddAdministradorComponent>,
      private fb: FormBuilder, // Constructor del formulario
      private administradoresService: AdministradoresService, // Servicio de administradores
      private dialog: MatDialog
    ) {}

    ngOnInit(): void {
      // Inicializar el formulario con campos vacíos y validaciones
    this.administradorForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(3)]],
      apellidos: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required]],
      permiso: ['ACTIVO', [Validators.required]]
    });

    }

    // Guardar los datos del administrador
  onSubmit(): void {
    if (this.administradorForm.valid) {
      this.administradoresService.addAdministrador(this.administradorForm.value).subscribe({
        next: (response) => {
          console.log('Administrador agregado correctamente:', response);
          this.dialogRef.close(true); // Cierra el modal y pasa "true"
        },
        error: (error) => {
          console.error('Error al agregar el administrador:', error);
        },
      });
    } else {
      console.log('Formulario inválido');
    }
  }

  closeModal(): void {
    this.dialogRef.close(); // Cierra el modal sin enviar datos
  }

  openModal(): void {
    this.dialog.open(ModalAddAdministradorComponent, {
      autoFocus: true, // Asegura que el foco esté en el modal
      restoreFocus: true // Restaura el foco en el elemento previo al cerrar
    });
}
}
