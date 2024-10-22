import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { CalendarComponent } from './calendar/calendar.component';
import { StteperFormComponent } from './stteper-form/stteper-form.component';
import { SpaceDialogComponent } from './dialog/spaceDialog/spaceDialog/spaceDialog.component';
import { WorkerDialogComponent } from './dialog/workerDialog/workerDialog/workerDialog.component';
import { TagsDialogComponent } from './dialog/tagsDialog/tagsDialog/tagsDialog.component';
import { ScheduableTaskDialogComponent } from './dialog/scheduableTaskDialog/scheduableTaskDialog/scheduableTaskDialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { schedulerASP } from './schedulerASP.service';
import { HttpClientModule } from '@angular/common/http';
import { HomePageComponent } from './home-page/home-page.component';
import { WorkerComponent } from './worker/worker.component';
import { SpaceComponent } from './space/space.component';
import { TaskComponent } from './task/task.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { GeneratedCalendarComponent } from './generatedCalendar/generatedCalendar.component';

import { AuthGuard } from './auth.guard';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { s } from '@fullcalendar/core/internal-common';
// import { CalendarWeekComponent } from './calendarWeek/calendarWeek.component';
import { NavBarComponent } from './navBar/navBar.component';
import { GeneratedCalendarOptionComponent } from './generatedCalendarOption/generatedCalendarOption.component';
import { EventDetailsComponent } from './event-details/event-details.component';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    StteperFormComponent,
    SpaceDialogComponent,
    WorkerDialogComponent,
    TagsDialogComponent,
    ScheduableTaskDialogComponent,
    HomePageComponent,
    WorkerComponent,
    SpaceComponent,
    TaskComponent,
    LoginComponent,
    RegisterComponent,
    NavBarComponent,
    GeneratedCalendarComponent,
    GeneratedCalendarOptionComponent,
    EventDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FullCalendarModule,
    MatInputModule,
    MatFormFieldModule,
    MatStepperModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatCheckboxModule,
    MatSelectModule,
    MatListModule,
    MatGridListModule,
    MatExpansionModule,
    MatDialogModule,
    MatChipsModule,
    MatIconModule,
    HttpClientModule,
    MatSidenavModule,
    MatToolbarModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    MatTooltipModule,
  ],
  providers: [schedulerASP, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
