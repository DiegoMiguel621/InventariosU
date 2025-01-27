import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  validacion: FormGroup;
  correo: FormControl;
  contra: FormControl;

  constructor(private router: Router, private authService: AuthService) {
    this.correo = new FormControl('', [
      Validators.required,
      Validators.email // Validación para correo electrónico
    ]);
    this.contra = new FormControl('', [
      Validators.required // Solo se valida que no esté vacío
    ]);

    this.validacion = new FormGroup({
      correo: this.correo,
      contra: this.contra
    });
  }

  handleSubmit(): void {
    if (this.validacion.valid) {
      const { correo, contra } = this.validacion.value;
  
      this.authService.login(correo, contra).subscribe({
        next: (response) => {
          console.log('Inicio de sesión exitoso:', response);
  
          // Guardar los datos del administrador en localStorage
          localStorage.setItem('admin', JSON.stringify(response.user));
  
          this.router.navigate(['/inicio']); // Redirigir al sistema
        },
        error: (error) => {
          console.error('Error al iniciar sesión:', error);
          alert('Correo o contraseña incorrectos');
        }
      });
    }
  }
}
