import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  signal,
  OnInit,
} from '@angular/core';
import { CalendarOptions, EventInput, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { createEventId, INITIAL_EVENTS } from './event-utils';
import { schedulerASP } from '../schedulerASP.service';
import { ActivatedRoute } from '@angular/router';

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
  constructor(
    private changeDetector: ChangeDetectorRef,
    private schedulerASP: schedulerASP,
    private route: ActivatedRoute
  ) {}

  timetable_id = 0;
  solution_id = 0;

  timetableStartTime = '09:00';
  timetableDuration = 60;
  apischedules: apiEvents[] = [];
  INITIAL_EVENTS: EventInput[] = INITIAL_EVENTS;
  events: EventInput[] = [];

  calendarVisible = signal(true);
  calendarOptions = signal<CalendarOptions>({
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin],
    headerToolbar: {
      center: 'title',
    },
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
  });
  currentEvents = signal<EventApi[]>([]);

  ngOnInit() {
    this.solution_id = parseInt(localStorage.getItem('solution_id') ?? '', 0);
    this.timetable_id = parseInt(localStorage.getItem('timetable_id') ?? '', 0);
    this.getAllSchedulesSolutions();
  }

  getDayIndex(day: string): number {
    const daysOfWeek: { [key: string]: number } = {
      domingo: 0,
      lunes: 1,
      maretes: 2,
      miercoles: 3,
      jueves: 4,
      viernes: 5,
      sabado: 6,
    };
    return daysOfWeek[day] ?? 1;
  }

  getAllSchedulesSolutions() {
    this.schedulerASP.generateTimetable(this.timetable_id).subscribe(
      (response: { solutions: Solution[] }) => {
        const selectedSolution = response.solutions.find(
          (solution: Solution) => solution.solution_id === this.solution_id
        );

        if (selectedSolution) {
          this.apischedules = selectedSolution.schedules.map(
            (scheduleString: string) => {
              const [day, number, name, schedule_worker, schedule_space] =
                scheduleString
                  .replace('schedule(', '')
                  .replace(')', '')
                  .split(',');

              return {
                name,
                day,
                number: parseInt(number, 10),
                schedule_space,
                schedule_worker,
                timeTable_schedule: this.solution_id,
              } as apiEvents;
            }
          );

          this.events = [];

          this.apischedules.forEach((apiWorker) => {
            const [startHour, startMinutes] = this.timetableStartTime
              .split(':')
              .map(Number);
            let startTimeInMinutes = startHour * 60 + startMinutes;
            startTimeInMinutes +=
              this.timetableDuration * (apiWorker.number - 1);

            const endTimeInMinutes =
              startTimeInMinutes + this.timetableDuration;
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
            };

            this.events.push(apiEvent);
          });

          this.calendarOptions().events = this.events;
          this.changeDetector.detectChanges();
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}
