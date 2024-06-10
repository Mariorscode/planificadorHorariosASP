import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  signal,
  OnInit,
} from '@angular/core';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { EventInput } from '@fullcalendar/core';
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

@Component({
  selector: 'app-generatedCalendarOption',
  templateUrl: './generatedCalendarOption.component.html',
  styleUrls: ['./generatedCalendarOption.component.css'],
})
export class GeneratedCalendarOptionComponent {
  constructor(
    private changeDetector: ChangeDetectorRef,
    private schedulerASP: schedulerASP,
    private route: ActivatedRoute
  ) {}
  timetable_id = 0;
  timetableStartTime = '09:00'; // Asignar un valor de ejemplo
  timetableDuration = 60; // Asignar un valor de ejemplo (en minutos)
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
    this.route.queryParams.subscribe((params) => {
      this.timetable_id = +params['timetable_id'];
      // Lógica para cargar eventos basados en timetable_id
      this.getAllSchedules();
    });
  }

  eventosNuevos() {
    const nuevosEventos: EventInput[] = [
      {
        id: createEventId(),
        title: 'EVENTO NUEVO',
        daysOfWeek: [1], // Lunes
        startTime: '10:00:00',
        endTime: '14:00:00',
      },
    ];

    this.calendarOptions().events = nuevosEventos;

    this.changeDetector.detectChanges();
  }
  getDayIndex(day: string): number {
    const daysOfWeek: { [key: string]: number } = {
      Domingo: 0,
      Lunes: 1,
      Martes: 2,
      Miércoles: 3,
      Jueves: 4,
      Viernes: 5,
      Sábado: 6,
    };
    return daysOfWeek[day] ?? 1;
  }
  getAllSchedules() {
    this.schedulerASP.getAllSchedulesByTimeTableId(this.timetable_id).subscribe(
      (response) => {
        console.log('Response all schedules:', response);
        this.apischedules = response;
        this.events = []; // Reiniciar eventos para evitar duplicados

        this.apischedules.forEach((apiWorker) => {
          // Convertir timetableStartTime a minutos
          const [startHour, startMinutes] = this.timetableStartTime
            .split(':')
            .map(Number);
          let startTimeInMinutes = startHour * 60 + startMinutes;

          // Calcular el nuevo startTime y endTime
          startTimeInMinutes += this.timetableDuration * (apiWorker.number - 1); // -1 porque empieza desde 0

          const endTimeInMinutes = startTimeInMinutes + this.timetableDuration;

          // Convertir minutos de vuelta a hh:mm
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
            daysOfWeek: [this.getDayIndex(apiWorker.day)], // Asignar el día de la semana correctamente
            startTime: `${newStartHour}:${newStartMinutes}:00`,
            endTime: `${newEndHour}:${newEndMinutes}:00`,
            allDay: false, // Asegurarse de que el evento no sea de todo el día
          };

          this.events.push(apiEvent);
        });

        // Actualizar los eventos en el calendario
        this.calendarOptions().events = this.events;
        this.changeDetector.detectChanges();
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}
