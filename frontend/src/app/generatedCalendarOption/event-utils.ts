import { EventInput } from '@fullcalendar/core';

let eventGuid = 0;

export const INITIAL_EVENTS: EventInput[] = [
  // {
  //   id: createEventId(),
  //   title: 'Evento de todo el día los lunes',
  //   daysOfWeek: [1], // Lunes
  //   startTime: '00:00:00',
  //   endTime: '07:00:00',
  // },
  // {
  //   id: createEventId(),
  //   title: 'Evento cronometrado de los martes',
  //   daysOfWeek: [2], // Martes
  //   startTime: '10:00:00',
  //   endTime: '12:00:00',
  //   display: 'background',
  // },
  // {
  //   id: createEventId(),
  //   title: 'Evento cronometrado de los miércoles',
  //   daysOfWeek: [3], // Miércoles
  //   startTime: '14:00:00',
  //   endTime: '16:00:00',
  // },
];

export function createEventId() {
  return String(eventGuid++);
}
