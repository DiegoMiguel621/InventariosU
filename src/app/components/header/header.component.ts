import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  nombreCompleto: string = ''; // Variable para mostrar el nombre

  ngOnInit(): void {
    // Comprobar si estamos en el navegador antes de usar localStorage
    if (typeof window !== 'undefined' && localStorage) {
      const adminData = localStorage.getItem('admin');
      if (adminData) {
        const admin = JSON.parse(adminData);
        this.nombreCompleto = `${admin.nombres} ${admin.apellidos}`;
      }
    }
  }
}
