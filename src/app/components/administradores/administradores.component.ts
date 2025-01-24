import { Component, OnInit } from '@angular/core';
import { AdministradoresService } from '../../service/administradores.service';

@Component({
  selector: 'app-administradores',
  templateUrl: './administradores.component.html',
  styleUrls: ['./administradores.component.css']
})
export class AdministradoresComponent implements OnInit {
  administradores: any[] = []; // Lista de administradores

  constructor(private administradoresService: AdministradoresService) {}

  ngOnInit(): void {
    this.getAdministradores(); // Cargar administradores al iniciar el componente
  }

  // Obtener la lista de administradores desde el servicio
  getAdministradores(): void {
    this.administradoresService.getAdministradores().subscribe(
      (data) => {
        this.administradores = data; // Guardar los datos en la variable
      },
      (error) => {
        console.error('Error al obtener administradores:', error);
      }
    );
  }
}
