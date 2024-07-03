import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { StteperFormComponent } from './stteper-form/stteper-form.component';
import { HomePageComponent } from './home-page/home-page.component';
import { WorkerComponent } from './worker/worker.component';
import { SpaceComponent } from './space/space.component';
import { TaskComponent } from './task/task.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { GeneratedCalendarComponent } from './generatedCalendar/generatedCalendar.component';

import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
  {
    path: 'stteperform',
    component: StteperFormComponent,
    canActivate: [AuthGuard],
  },
  { path: 'homepage', component: HomePageComponent, canActivate: [AuthGuard] },
  { path: 'workers', component: WorkerComponent, canActivate: [AuthGuard] },
  { path: 'spaces', component: SpaceComponent, canActivate: [AuthGuard] },
  { path: 'tasks', component: TaskComponent, canActivate: [AuthGuard] },
  {
    path: 'generatedCalendar',
    component: GeneratedCalendarComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/homepage', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
