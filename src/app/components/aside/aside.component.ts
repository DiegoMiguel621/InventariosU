import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importar el Router

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent {
  constructor(private router: Router) {}

  cerrarSesion(): void {
    // Eliminar datos del localStorage
    localStorage.removeItem('admin');

    // Redirigir al login
    this.router.navigate(['/login']);
  }
}
