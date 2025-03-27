import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrabajadoresService } from '../service/trabajadores.service'; // Servicio para trabajadores
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-agregar-personal',
  templateUrl: './modal-agregar-personal.component.html',
  styleUrls: ['./modal-agregar-personal.component.css']
})
export class ModalAgregarPersonalComponent implements OnInit {
  addPersonalForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private trabajadoresService: TrabajadoresService, // Servicio para interactuar con la API
    private dialogRef: MatDialogRef<ModalAgregarPersonalComponent> // Referencia al modal
  ) {}

  ngOnInit(): void {
    // Inicializa el formulario reactivo
    this.addPersonalForm = this.fb.group({
      nombre: ['', [Validators.required]],
      numero: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      area: ['', [Validators.required]],
      ubicacion: ['', [Validators.required]],
      perfilAcad: ['', [Validators.required]],
      puesto: ['', [Validators.required]],
      estatus: ['ACTIVO', [Validators.required]],
      correoPersonal: ['', [Validators.required, Validators.email]],
      correoInstit: ['', [Validators.required, Validators.email]],
      rfcTrabaj: ['', [Validators.required]]
    });
  }

  // Función para guardar el trabajador
  onSubmit(): void {
    if (this.addPersonalForm.valid) {
      this.trabajadoresService.addTrabajador(this.addPersonalForm.value).subscribe({
        next: (response) => {
          console.log('Trabajador agregado correctamente:', response);
          this.dialogRef.close(true); // Cierra el modal y pasa "true"
        },
        error: (error) => {
          console.error('Error al agregar el trabajador:', error);
        },
      });
    } else {
      console.error('Formulario inválido');
    }
  }
  
  
  
  

  closeModal(): void {
    this.dialogRef.close(); // Cierra el modal sin enviar datos
  }
  

}
