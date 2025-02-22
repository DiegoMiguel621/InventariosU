import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalErrorComponent } from '../../components/modal-error/modal-error.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  validacion: FormGroup;
  correo: FormControl;
  contra: FormControl;

  constructor(private router: Router, private authService: AuthService, public dialog: MatDialog) {
    this.correo = new FormControl('', [
      Validators.required,
      Validators.email, // Validación para correo electrónico
      Validators.maxLength(50),  // 🔹 Límite de 50 caracteres para correo
      Validators.pattern(/^\S*$/) // 🔹 No permite espacios en blanco
    ]);
    this.contra = new FormControl('', [
      Validators.required, // Solo se valida que no esté vacío
      Validators.maxLength(20), // 🔹 Límite de 20 caracteres para contraseña
      Validators.pattern(/^\S*$/) // 🔹 No permite espacios en blanco
    ]);

    this.validacion = new FormGroup({
      correo: this.correo,
      contra: this.contra
    });
  }

  handleSubmit(): void {
    console.log('🔵 handleSubmit() se está ejecutando');

    if (this.validacion.invalid) {
      console.log('⚠️ Formulario vacío o inválido');
      this.abrirModal('Debes ingresar tu correo y contraseña');
      return; // 🔹 Detiene la ejecución si los campos están vacíos
    }

    const { correo, contra } = this.validacion.value;
    console.log('📩 Datos ingresados:', { correo, contra });

    this.authService.login(correo, contra).subscribe({
      next: (response) => {
        console.log('✅ Inicio de sesión exitoso:', response);
        localStorage.setItem('admin', JSON.stringify(response.user));
        this.router.navigate(['/inicio']);
      },
      error: (error) => {
        console.error('🔴 Error al iniciar sesión:', error);
        console.log('🟠 Llamando a abrirModal()');

        this.abrirModal('Correo o contraseña incorrectos');
      }
    });
  }



  abrirModal(mensaje: string): void {
    console.log('🟠 abrirModal() llamado con mensaje:', mensaje);
    this.dialog.open(ModalErrorComponent, {
      data: { mensaje }
    });
  }




}
