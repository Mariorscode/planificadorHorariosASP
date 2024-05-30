import { Component, ViewChild } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { Worker } from './stteper-form/stteper-form.component';
import { HomePageComponent } from './home-page/home-page.component';
import { StteperFormComponent } from './stteper-form/stteper-form.component';

import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  showSidenav = true;

  constructor(private router: Router) {
    // Suscribirse a los eventos de navegación para controlar la visibilidad del sidenav
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        // Aquí definimos las rutas que no deberían mostrar el sidenav
        const noSidenavRoutes = ['/stteperform'];
        this.showSidenav = !noSidenavRoutes.includes(event.urlAfterRedirects);
      });
  }
}
