import { Component, OnInit } from '@angular/core';
import { schedulerASP } from '../schedulerASP.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

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
  selector: 'app-generatedCalendar',
  templateUrl: './generatedCalendar.component.html',
  styleUrls: ['./generatedCalendar.component.css'],
})
export class GeneratedCalendarComponent implements OnInit {
  apiSchedules: apiEvents[] = [];
  solutions: any[] = [];
  displayedSolutions: any[] = [];
  currentIndex = 0;
  pageSize = 10;
  solution_id: number = 1;
  reloadCalendarOption = false;

  timetable_id = parseInt(localStorage.getItem('timetable_id') ?? '', 0);

  constructor(
    private schedulerASP: schedulerASP,
    private router: Router,
    private location: Location
  ) {}

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
        console.log('Solutions:', this.solutions);
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

    this.location.go(this.location.path());
    location.reload();
  }

  saveSolution() {
    let solution_id = parseInt(localStorage.getItem('solution_id') || '0', 0);
    const selectedSolution = this.solutions.find(
      (solution: Solution) => solution.solution_id === solution_id
    );

    if (selectedSolution) {
      this.apiSchedules = selectedSolution.schedules.map(
        (scheduleString: string) => {
          const [day, number, name, schedule_worker, schedule_space] =
            scheduleString.replace('schedule(', '').replace(')', '').split(',');

          return {
            name,
            day,
            number: parseInt(number, 10),
            schedule_space,
            schedule_worker,
            timeTable_schedule: this.timetable_id,
          } as apiEvents;
        }
      );

      this.schedulerASP.createAllSchedules(this.apiSchedules).subscribe(
        (response) => {
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    }
  }
}
