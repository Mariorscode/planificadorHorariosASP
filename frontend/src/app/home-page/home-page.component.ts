import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  ngOnInit(): void {
    this.add(1);
  }

  columnas: any[][] = [[]];

  add(columna: number): void {
    this.columnas[columna - 1].push({
      /* Datos de la card */
    });
  }
}
