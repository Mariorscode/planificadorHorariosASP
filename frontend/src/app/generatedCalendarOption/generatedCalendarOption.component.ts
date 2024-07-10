// generated-calendar-option.component.ts
import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  OnInit,
  SimpleChanges,
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
import { createEventId, INITIAL_EVENTS } from './event-utils';
import { schedulerASP } from '../schedulerASP.service';
import { ActivatedRoute } from '@angular/router';
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

interface Solution {
  solution_id: number;
  schedules: string[];
}

@Component({
  selector: 'app-generatedCalendarOption',
  templateUrl: './generatedCalendarOption.component.html',
  styleUrls: ['./generatedCalendarOption.component.css'],
})
export class GeneratedCalendarOptionComponent implements OnInit {
  @Input() selectedSolution: Solution | null = null; // Input para recibir la solución seleccionada

  constructor(
    private changeDetector: ChangeDetectorRef,
    private schedulerASP: schedulerASP,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  timetable_id = 0;
  solution_id = 0;

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
  currentEvents: EventApi[] = [];

  ngOnInit() {
    this.solution_id = parseInt(localStorage.getItem('solution_id') ?? '', 10);
    this.timetable_id = parseInt(
      localStorage.getItem('timetable_id') ?? '',
      10
    );

    this.getTimeTableByID();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedSolution'] && this.selectedSolution) {
      this.loadSolution(this.selectedSolution);
    }
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
        this.timetableStartTime = response.start_time || '00:00';
        this.timetableDuration = response.turnsDuration || 60;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  loadSolution(solution: Solution) {
    this.apischedules = solution.schedules.map((scheduleString: string) => {
      const [day, number, name, schedule_worker, schedule_space] =
        scheduleString.replace('schedule(', '').replace(')', '').split(',');

      return {
        name,
        day,
        number: parseInt(number, 10),
        schedule_space,
        schedule_worker,
        timeTable_schedule: this.solution_id,
      } as apiEvents;
    });

    this.events = [];

    this.apischedules.forEach((apiWorker) => {
      if (!this.timetableStartTime) {
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
      const newEndMinutes = (endTimeInMinutes % 60).toString().padStart(2, '0');

      const apiEvent: EventInput = {
        id: createEventId(),
        title: `${apiWorker.name} - ${apiWorker.schedule_space} - ${apiWorker.schedule_worker}`,
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

    this.calendarOptions.update((options) => ({
      ...options,

      events: this.events,
    }));

    this.changeDetector.detectChanges();
  }

  handleEventClick(eventClickInfo: EventClickArg) {
    const event: EventApi = eventClickInfo.event;

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
