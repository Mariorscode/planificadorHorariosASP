import { Component, OnInit } from '@angular/core';
import { schedulerASP } from '../schedulerASP.service';
import { s } from '@fullcalendar/core/internal-common';
import { Router } from '@angular/router';

interface Timetable {
  id: number;
  name: string;
  turnsDuration: number;
  turnsPerDay: number;
  start_time: string;
}

interface timetableCards {
  id: number;
  name: string;
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent {
  timetables: Timetable[] = [];
  apiTimetables: Timetable[] = [];
  timetableCards: timetableCards[] = [];

  user_id = 1;

  ngOnInit(): void {
    console.log('User ID:', this.user_id);
    this.getAllTimetables();
  }

  getAllTimetables() {
    this.schedulerASP.getAllTimetablesByUserId(this.user_id).subscribe(
      (data: any) => {
        console.log('Data:', data);
        this.apiTimetables = data;
        console.log('API Timetables:', this.apiTimetables);
        this.timetables = this.apiTimetables.map((timetable) => {
          return {
            id: timetable.id,
            name: timetable.name,
            turnsDuration: timetable.turnsDuration,
            turnsPerDay: timetable.turnsPerDay,
            start_time: timetable.start_time,
          };
        });
        this.loadTimetableCards();
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
    console.log('Timetables');
    console.log('Timetables:', this.timetables);
  }

  deleteTimetable(deleteTimetable: number): void {
    // Find the index of the worker to delete
    const index = this.timetables.findIndex(
      (timetable) => timetable.id === deleteTimetable
    );

    const apiIndex = this.apiTimetables.findIndex(
      (timetable) => timetable.id === deleteTimetable
    );

    // Delete the worker from the workers array
    this.timetables.splice(index, 1);

    this.schedulerASP
      .deleteTimetable(this.apiTimetables[apiIndex].id)
      .subscribe((response) => {
        console.log('Response:', response);
      });

    // Reload the worker cards
    this.loadTimetableCards();
  }
  loadTimetableCards(): void {
    // delete the existing worker cards
    this.timetableCards = [];

    // iterate over the workers array and create a card for each worker
    this.timetables.forEach((timetable: Timetable) => {
      // Create a new card object with the worker data
      const newCard = {
        id: timetable.id,
        name: timetable.name,
        // restrictionsWorker: worker.restrictionsWorker,
      };

      // Add the card to the workerCards array
      this.timetableCards.push(newCard);
    });
  }
  generateSchedule() {
    // Lógica para generar el horario y llamar al componente StatePerform
    this.router.navigate(['/stteperform'], {
      queryParams: { user_id: this.user_id },
    });
  }

  visualizeTimetable(timetableId: number) {
    this.router.navigate(['/calendar'], {
      queryParams: { timetable_id: timetableId },
    });
  }

  constructor(private schedulerASP: schedulerASP, private router: Router) {}
}
