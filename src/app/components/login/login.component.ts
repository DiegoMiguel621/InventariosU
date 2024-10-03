import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppComponent } from '../../app.component';
import { Router } from '@angular/router'; //importar router





@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  validacion: FormGroup;
  matricula: FormControl;
  contra: FormControl;

  constructor(private router: Router){ //router para inyectar
    this.matricula= new FormControl('', [ //validar
      Validators.required,
      Validators.pattern('^[0-9]{10}$') 
    ]);
    this.contra= new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9]{1,15}$')
    ]);

    this.validacion= new FormGroup({
      matricula: this.matricula,
      contra: this.contra
    });
  }


  handleSubmit(): void{
    console.log('Sesion iniciada: ', this.validacion.value);
    this.validacion.reset();
    this.router.navigate(['/inicio']); //redireccionar a otra pestaña




  }
}








