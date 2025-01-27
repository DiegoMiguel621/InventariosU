import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  nombreCompleto: string = ''; // Almacena el nombre completo del administrador

  ngOnInit(): void {
    // Recuperar los datos del administrador del localStorage
    const adminData = localStorage.getItem('admin');
    if (adminData) {
      const admin = JSON.parse(adminData);
      this.nombreCompleto = `${admin.nombres} ${admin.apellidos}`;
    }
  }
}
