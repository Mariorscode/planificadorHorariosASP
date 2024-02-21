import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ComponenteEventosComponent } from './componente-eventos/componente-eventos.component';
import { ApiService } from './service/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ComponenteEventosComponent],
  providers: [ApiService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'frontend';

}
