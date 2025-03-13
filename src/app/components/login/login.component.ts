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

  constructor(private router: Router, private authService: AuthService, public dialog: MatDialog) {
    this.validacion = new FormGroup({
      correo: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(50),
        Validators.pattern(/^\S*$/)
      ]),
      contra: new FormControl('', [
        Validators.required,
        Validators.maxLength(20),
        Validators.pattern(/^\S*$/)
      ])
    });
  }

  handleSubmit(): void {
    console.log('🔵 handleSubmit() SE EJECUTÓ');

    const correo = this.validacion.get('correo')?.value.trim();
    const contra = this.validacion.get('contra')?.value.trim();

    console.log('📩 Valores ingresados:', { correo, contra });

    // 🟡 Caso 1: Ambos campos vacíos
    if (!correo && !contra) {
      console.log('⚠️ Ambos campos están vacíos');
      this.abrirModal('Debes ingresar tu correo y contraseña');
      return;
    }

    // 🟠 Caso 2: Solo el correo está vacío
    if (!correo) {
      console.log('⚠️ El campo de correo está vacío');
      this.abrirModal('Debes ingresar tu correo');
      return;
    }

    // 🔵 Caso 3: Solo la contraseña está vacía
    if (!contra) {
      console.log('⚠️ El campo de contraseña está vacío');
      this.abrirModal('Debes ingresar tu contraseña');
      return;
    }

    // Si ambos campos están llenos, intentamos iniciar sesión
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

    setTimeout(() => {
      this.dialog.open(ModalErrorComponent, {
        data: { mensaje }
      });
    }, 100);
  }


}
