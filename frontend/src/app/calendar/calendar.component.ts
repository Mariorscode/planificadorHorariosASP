import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  signal,
} from '@angular/core';
import {
  CalendarOptions,
  EventInput,
  EventApi,
  EventClickArg,
} from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { schedulerASP } from '../schedulerASP.service';
import { ActivatedRoute } from '@angular/router';
import { createEventId, INITIAL_EVENTS } from './event-utils';
import { MatDialog } from '@angular/material/dialog';
import { EventDetailsComponent } from '../event-details/event-details.component';

interface apiEvents {
  name: string;
  day: string;
  number: number;
  schedule_space: string;
  schedule_worker: string;
  timeTable_schedule: number;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit {
  timetable_id = 0;
  timetableStartTime = '00:00';
  timetableDuration = 60;
  apischedules: apiEvents[] = [];
  INITIAL_EVENTS: EventInput[] = INITIAL_EVENTS;
  events: EventInput[] = [];

  calendarVisible = signal(true);
  calendarOptions = signal<CalendarOptions>({
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin],
    views: {
      dayGridWeek: {
        dayHeaderFormat: {
          weekday: 'long',
        },
      },
    },
    locale: 'es',
    firstDay: 1,
    initialView: 'timeGridWeek',
    initialEvents: this.INITIAL_EVENTS,
    weekends: true,
    eventClick: this.handleEventClick.bind(this),
  });
  currentEvents = signal<EventApi[]>([]);

  constructor(
    private changeDetector: ChangeDetectorRef,
    private schedulerASP: schedulerASP,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.timetable_id = +params['timetable_id'];
      console.log('Timetable ID:', this.timetable_id);
      this.getTimeTableByID();
      this.getAllSchedules();
    });
  }

  getDayIndex(day: string): number {
    const daysOfWeek: { [key: string]: number } = {
      domingo: 0,
      lunes: 1,
      martes: 2,
      miercoles: 3,
      jueves: 4,
      viernes: 5,
      sabado: 6,
    };
    return daysOfWeek[day.toLowerCase()] ?? 1;
  }

  getTimeTableByID() {
    this.schedulerASP.getTimetable(this.timetable_id).subscribe(
      (response: { start_time: string; turnsDuration: number }) => {
        console.log('Response:', response);
        this.timetableStartTime = response.start_time || '00:00';
        this.timetableDuration = response.turnsDuration || 60;
        console.log('Timetable Start Time:', this.timetableStartTime);
        console.log('Timetable Duration:', this.timetableDuration);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  getAllSchedules() {
    this.schedulerASP.getAllSchedulesByTimeTableId(this.timetable_id).subscribe(
      (response) => {
        console.log('Response all schedules:', response);
        this.apischedules = response;
        this.events = [];

        this.apischedules.forEach((apiWorker) => {
          if (!this.timetableStartTime) {
            console.error('timetableStartTime is undefined');
            return;
          }

          const [startHour, startMinutes] = this.timetableStartTime
            .split(':')
            .map(Number);
          let startTimeInMinutes = startHour * 60 + startMinutes;

          startTimeInMinutes += this.timetableDuration * (apiWorker.number - 1);

          const endTimeInMinutes = startTimeInMinutes + this.timetableDuration;
          const newStartHour = Math.floor(startTimeInMinutes / 60)
            .toString()
            .padStart(2, '0');
          const newStartMinutes = (startTimeInMinutes % 60)
            .toString()
            .padStart(2, '0');
          const newEndHour = Math.floor(endTimeInMinutes / 60)
            .toString()
            .padStart(2, '0');
          const newEndMinutes = (endTimeInMinutes % 60)
            .toString()
            .padStart(2, '0');

          const apiEvent: EventInput = {
            id: createEventId(),
            title: apiWorker.name,
            daysOfWeek: [this.getDayIndex(apiWorker.day)],
            startTime: `${newStartHour}:${newStartMinutes}:00`,
            endTime: `${newEndHour}:${newEndMinutes}:00`,
            allDay: false,
            extendedProps: {
              worker: apiWorker.schedule_worker,
              space: apiWorker.schedule_space,
            },
          };

          this.events.push(apiEvent);
        });

        this.calendarOptions().events = this.events;
        this.changeDetector.detectChanges();
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
  handleEventClick(eventClickInfo: EventClickArg) {
    const event: EventApi = eventClickInfo.event;
    console.log('Event clicked:', event);

    const dialogRef = this.dialog.open(EventDetailsComponent, {
      data: {
        title: event.title,
        startTime: event.startStr,
        endTime: event.endStr,
        worker: event.extendedProps['worker'],
        space: event.extendedProps['space'],
      },
    });
  }
}
