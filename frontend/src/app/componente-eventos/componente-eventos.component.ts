import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-componente-eventos',
  templateUrl: './componente-eventos.component.html',
  styleUrls: ['./componente-eventos.component.css'],
  providers: [ApiService], // Agrega el servicio en el array providers
  imports: [CommonModule],
})

// export class ComponenteEventosComponent {
// }
export class ComponenteEventosComponent implements OnInit {
  datos: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.obtenerDatos();
  }

  obtenerDatos(): void {
    this.apiService.obtenerDatos().subscribe(
      (data) => {
        this.datos = data;
        console.log('Datos obtenidos:', this.datos);
        // Puedes realizar operaciones con los datos aquí
      },
      (error) => {
        console.error('Error al obtener datos:', error);
        // Maneja los errores aquí
      }
    );
  }
}
