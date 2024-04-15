import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { StteperFormComponent } from './stteper-form/stteper-form.component';

const routes: Routes = [
  { path: 'calendar', component: CalendarComponent },
  { path: 'stteperform', component: StteperFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
