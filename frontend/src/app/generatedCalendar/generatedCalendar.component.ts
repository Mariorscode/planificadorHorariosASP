import { Component, OnInit } from '@angular/core';
import { schedulerASP } from '../schedulerASP.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-generatedCalendar',
  templateUrl: './generatedCalendar.component.html',
  styleUrls: ['./generatedCalendar.component.css'],
})
export class GeneratedCalendarComponent implements OnInit {
  solutions: any[] = [];
  displayedSolutions: any[] = [];
  currentIndex = 0;
  pageSize = 10;
  solution_id: number | null = null;
  reloadCalendarOption = false; // Agrega una bandera para indicar la recarga del componente

  constructor(private schedulerASP: schedulerASP, private router: Router) {}

  ngOnInit() {
    this.getGeneratedSchedules();
  }

  getGeneratedSchedules() {
    const timetable_id = parseInt(
      localStorage.getItem('timetable_id') || '0',
      0
    );
    this.schedulerASP.generateTimetable(timetable_id).subscribe(
      (response) => {
        console.log('Generated schedules:', response);
        this.solutions = response.solutions;
        this.loadMoreSolutions();
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  loadMoreSolutions() {
    const nextIndex = this.currentIndex + this.pageSize;
    this.displayedSolutions = this.displayedSolutions.concat(
      this.solutions.slice(this.currentIndex, nextIndex)
    );
    this.currentIndex = nextIndex;
  }

  selectSolution(solution: any) {
    this.solution_id = solution.solution_id;
    localStorage.setItem('solution_id', solution.solution_id);
    console.log('Solution selected:', solution.solution_id);
    this.reloadCalendarOption = !this.reloadCalendarOption; // Cambia la bandera para forzar la recarga
    this.ngOnInit();
  }
}
