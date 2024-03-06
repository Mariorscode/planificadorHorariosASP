import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  columnas: any[][] = [[]];

  agregarCard(columna: number): void {
    this.columnas[columna - 1].push({
      /* Datos de la card */
    });
  }
}
