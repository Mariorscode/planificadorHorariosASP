import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { StteperFormComponent } from './stteper-form/stteper-form.component';
import { HomePageComponent } from './home-page/home-page.component';
import { WorkerComponent } from './worker/worker.component';
import { SpaceComponent } from './space/space.component';
import { TaskComponent } from './task/task.component';

// import { CalendarWeekComponent } from './calendarWeek/calendarWeek.component';

const routes: Routes = [
  { path: 'calendar', component: CalendarComponent },
  { path: 'stteperform', component: StteperFormComponent },
  { path: 'homepage', component: HomePageComponent },
  { path: 'workers', component: WorkerComponent },
  { path: 'spaces', component: SpaceComponent },
  { path: 'tasks', component: TaskComponent },
  // { path: 'calendarWeek', component: CalendarWeekComponent },
  { path: '', redirectTo: '/homepage', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
