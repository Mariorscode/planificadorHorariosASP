import { Component, OnInit } from '@angular/core';
import { ScheduableTaskDialogComponent } from '../dialog/scheduableTaskDialog/scheduableTaskDialog/scheduableTaskDialog.component';
import { MatDialog } from '@angular/material/dialog';
import { schedulerASP } from '../schedulerASP.service';

export interface ScheduableTask {
  name: string;
  size: number;
}

interface apiScheduableTask {
  id: number;
  name: string;
  task_size: number;
  task_restrictions: number[];
  task_tags: number[];
  task_worker: number;
  task_spaces: number;
  timetable_id: number;
}

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent {
  taskCards: ScheduableTask[] = [];
  scheduableTasks: ScheduableTask[] = [];
  apiTasks: apiScheduableTask[] = [];

  ngOnInit() {
    this.getCommonTasksById();
  }

  openScheduableTaskDialog(scheduableTask?: ScheduableTask) {
    let dialogRef;

    if (scheduableTask) {
      dialogRef = this.dialog.open(ScheduableTaskDialogComponent, {
        data: {
          taskName: scheduableTask.name,
          taskSize: scheduableTask.size,
          isCommon: true,
          eliminate: this.deletetask.bind(this),
        },
      });
    } else {
      dialogRef = this.dialog.open(ScheduableTaskDialogComponent, {
        data: {
          taskName: null,
          taskSize: null,
          isCommon: true,
          eliminate: this.deletetask.bind(this),
        },
      });
    }

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newTask: ScheduableTask = {
          name: result.name,
          size: result.taskSize,
        };
        const newTaskApi: any = {
          name: result.name,
          task_size: result.taskSize,
          user_id: localStorage.getItem('userId'),
        };

        if (scheduableTask) {
          // If the worker was provided (modification case), find its index
          const existingtaskIndex = this.scheduableTasks.findIndex(
            (t) => t.name === scheduableTask.name
          );

          if (existingtaskIndex !== -1) {
            // Update the existing worker
            this.scheduableTasks[existingtaskIndex] = newTask;
            this.updateCommonTask(
              this.apiTasks[existingtaskIndex].id,
              newTaskApi
            );
          }
        } else {
          // If no worker was provided (creation case), add the new worker
          this.scheduableTasks.push(newTask);
          this.createCommonTask(newTaskApi);
        }

        this.loadTaskCards();
      }
    });
  }

  deletetask(deleteTask: String): void {
    // Find the index of the worker to delete
    const index = this.scheduableTasks.findIndex(
      (task) => task.name === deleteTask
    );

    const apiIndex = this.apiTasks.findIndex(
      (task) => task.name === deleteTask
    );

    // Delete the worker from the workers array
    this.scheduableTasks.splice(index, 1);

    this.schedulerASP
      .deleteCommonTasksById(this.apiTasks[apiIndex].id)
      .subscribe((response) => {
        console.log('Response:', response);
      });

    // Reload the worker cards
    this.loadTaskCards();
  }

  loadTaskCards(): void {
    // delete the existing space cards
    this.taskCards = [];

    // iterate over the spaces array and create a card for each space
    this.scheduableTasks.forEach((task: ScheduableTask) => {
      // Create a new card object with the space data
      const newCard = {
        name: task.name,
        size: task.size,
      };

      // Add the card to the spaceCards array
      this.taskCards.push(newCard);
    });
  }

  createCommonTask(data: any) {
    this.schedulerASP.createCommonTasks(data).subscribe(
      (response) => {
        console.log('Response:', response);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  updateCommonTask(taskId: number, data: any) {
    this.schedulerASP.updateCommonTasks(taskId, data).subscribe(
      (response) => {
        console.log('Response:', response);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  getCommonTasksById() {
    this.schedulerASP.getCommonTasksByUserId().subscribe(
      (response) => {
        console.log('Response all common workers:', response);
        this.apiTasks = response;
        this.apiTasks.forEach((apiTask) => {
          const newTask: ScheduableTask = {
            name: apiTask.name,
            size: apiTask.task_size,
          };
          this.scheduableTasks.push(newTask);
        });
        this.loadTaskCards();
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
  constructor(public dialog: MatDialog, private schedulerASP: schedulerASP) {}
}
