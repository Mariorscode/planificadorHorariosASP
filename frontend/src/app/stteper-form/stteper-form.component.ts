import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SpaceDialogComponent } from '../dialog/spaceDialog/spaceDialog/spaceDialog.component';
import { WorkerDialogComponent } from '../dialog/workerDialog/workerDialog/workerDialog.component';
import { TagsDialogComponent } from '../dialog/tagsDialog/tagsDialog/tagsDialog.component';
import { ScheduableTaskDialogComponent } from '../dialog/scheduableTaskDialog/scheduableTaskDialog/scheduableTaskDialog.component';
import { co, s } from '@fullcalendar/core/internal-common';
import { schedulerASP } from '../schedulerASP.service';
import { empty } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Turn {
  day: String;
  startTime: String;
  is_free_time?: boolean;
  displayTime?: String;
}

export interface Space {
  name: string;
  spaceCapacity: number;
  restrictionsSpace: Turn[];
}
export interface Worker {
  name: string;
  restrictionsWorker: Turn[];
}
export interface Tag {
  name: string;
}
export interface ScheduableTask {
  name: string;
  size: number;
  restrictions?: Turn[];
  taskWorker?: Worker[];
  taskSpace?: Space[];
  taskTags?: Tag[];
}

interface apiScheduableTask {
  name: string;
  task_size: number;
  task_restrictions: number[];
  task_tags: number[];
  task_worker: number;
  task_spaces: number;
  timetable_id: number;
}

interface ApiTimeTable {
  id: number;
  name: string;
  turnsDuration: number;
  turnsPerDay: number;
}

interface ApiTurns {
  id: number;
  day: string;
  startTime: string;
  is_free_time: boolean;
}

interface ApiSpaces {
  id: number;
  name: string;
  space_capacity: number;
  restrictionsSpace: number[];
  user_id: number;
}

interface ApiWorkers {
  id: number;
  name: string;
  restrictionsWorker: number[];
}

@Component({
  selector: 'app-stteper-form',
  templateUrl: './stteper-form.component.html',
  styleUrls: ['./stteper-form.component.css'],
})
export class StteperFormComponent {
  isLast(item: any, array: any[]): boolean {
    return item === array[array.length - 1];
  }

  // Variables
  // userid: number = 0;

  daysOfWeek: string[] = [
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];
  // weekDays = new FormControl();
  numberOfTurns: number = 0;
  weekDaysRestriction = new FormControl();
  turns: Turn[] = [];
  selectedTurns: Turn[] = [];

  apiTimeTable: ApiTimeTable = {
    id: 0,
    name: '',
    turnsDuration: 0,
    turnsPerDay: 0,
  };
  apiTurns: ApiTurns[] = [];
  apiSpaces: ApiSpaces[] = [];
  apiWorkers: ApiWorkers[] = [];
  apiScheduableTasks: apiScheduableTask[] = [];

  spaces: Space[] = [];
  workers: Worker[] = [];
  scheduableTasks: ScheduableTask[] = [];

  availableTags: Tag[] = [];
  taskTags: Tag[] = [];

  //-------------------- Form Steps --------------------

  // First formStep
  firstFormGroup = this._formBuilder.group(
    {
      scheduleName: ['', Validators.required],
      weekDays: ['', Validators.required],
      turnDuration: ['', Validators.required],
      firstTurnTime: ['', Validators.required],
      lastTurnTime: ['', Validators.required],
      // weekDaysRestriction: this.weekDaysRestriction,
      // dayTimerestriction: ['', Validators.required],
      numberOfTurns: this.numberOfTurns,
    },
    { validator: [this.timeValidator, this.durationValidator] }
  );
  // Second formStep
  secondFormGroup = this._formBuilder.group({
    turns: [this.turns, Validators.required],
    // selectedTurns: [this.selectedTurns, Validators.required],
  });
  // Third formStep
  thirdFormGroup = this._formBuilder.group({
    spaces: [this.spaces],
  });
  // Fourth formStep
  fourthFormGroup = this._formBuilder.group({
    workers: [this.workers],
  });
  fithFormGroup = this._formBuilder.group({
    scheduableTasks: [this.scheduableTasks],
  });

  isLinear = true;

  //--------------------/Form Steps --------------------
  disableStepHeaders: boolean = true;
  //-------------------- Methods --------------------

  // excute at the load of the component
  ngOnInit(): void {
    this.getAllCommonSpaces();
    this.getAllCommonWorkers();
    this.getAllCommonTasks();
  }

  ngAfterViewInit(): void {
    // Trigger validation on load
    this.firstFormGroup.markAllAsTouched();
  }

  timeValidator(firstFormGroup: FormGroup) {
    const firstTurnTime = firstFormGroup.get('firstTurnTime')?.value;
    const lastTurnTime = firstFormGroup.get('lastTurnTime')?.value;

    if (firstTurnTime && lastTurnTime) {
      const firstTime = new Date(`2022-01-01T${firstTurnTime}`);
      const lastTime = new Date(`2022-01-01T${lastTurnTime}`);

      if (lastTime <= firstTime) {
        firstFormGroup
          .get('lastTurnTime')
          ?.setErrors({ invalidTimeRange: true });
      } else {
        firstFormGroup.get('lastTurnTime')?.setErrors(null);
      }
    }
  }
  lastTurnTimeCompleted: boolean = false;

  validateTime() {
    this.timeValidator(this.firstFormGroup);
    this.lastTurnTimeCompleted = true;
  }

  durationValidator(firstFormGroup: FormGroup) {
    const firstTurnTime = firstFormGroup.get('firstTurnTime')?.value;
    const lastTurnTime = firstFormGroup.get('lastTurnTime')?.value;
    const turnDuration = firstFormGroup.get('turnDuration')?.value;

    if (
      firstTurnTime &&
      lastTurnTime &&
      turnDuration !== null &&
      turnDuration !== undefined
    ) {
      const firstTime = new Date(`2022-01-01T${firstTurnTime}`);
      const lastTime = new Date(`2022-01-01T${lastTurnTime}`);

      // Calculate the time difference in minutes
      const timeDifferenceMinutes =
        (lastTime.getTime() - firstTime.getTime()) / (1000 * 60);

      if (turnDuration > timeDifferenceMinutes) {
        firstFormGroup
          .get('turnDuration')
          ?.setErrors({ invalidDuration: true });
      } else {
        firstFormGroup.get('turnDuration')?.setErrors(null);
      }
    }
  }

  checkAllDaysSelected(): boolean {
    let i: number = 0;
    for (const tun of this.turns) {
      if (tun.is_free_time === true) {
        i++;
      }
    }
    if (i === this.turns.length) {
      return true;
    } else {
      return false;
    }
  }

  allDaysSelected: boolean = false;
  showAlertIfAllDaysSelected() {
    if (this.checkAllDaysSelected()) {
      this.allDaysSelected = true;
      this.snackBar.open(
        'No puedes seleccionar todos los turnos, al menos debe haber un turno libre',
        'Cerrar',
        {
          duration: 3000,
        }
      );
    } else {
      this.allDaysSelected = false;
    }
  }

  remove(tag: Tag): void {
    const index = this.availableTags.indexOf(tag);

    if (index >= 0) {
      this.availableTags.splice(index, 1);
    }
  }
  // calculate the number of turns per day given the first and last turn time and the turn duration
  calculateTurnsPerDay(): number {
    const firstTurnTimeStr = this.firstFormGroup.get('firstTurnTime')?.value;
    const lastTurnTimeStr = this.firstFormGroup.get('lastTurnTime')?.value;
    const turnDuration = this.firstFormGroup.get('turnDuration')?.value; // Duration of turn in minutes

    // Verify if the values are valid
    if (typeof turnDuration !== 'number' || isNaN(turnDuration)) {
      console.error('La duración del turno no es un número válido.');
      return -1; // return -1 if the values are not valid for managing the error
    }

    //Cast the time strings to Date objects
    const firstTurnTime = new Date(`2022-01-01T${firstTurnTimeStr}`);
    const lastTurnTime = new Date(`2022-01-01T${lastTurnTimeStr}`);

    // Calculate the difference in minutes between the first and last turn time
    const differenceInMilliseconds =
      lastTurnTime.getTime() - firstTurnTime.getTime();
    const differenceInMinutes = Math.floor(
      differenceInMilliseconds / (1000 * 60)
    );

    // Calculate the number of turns
    const numberOfTurns = Math.floor(differenceInMinutes / turnDuration);

    return numberOfTurns;
  }

  // Fill the turns array with the turns calculated from the form values
  auxTurns: Turn[] = []; // Array to store the auxiliary turns
  fillTurns() {
    // get the values from the form
    const turnDuration = this.firstFormGroup.get('turnDuration')?.value;
    const firstTurnTimeStr = this.firstFormGroup.get('firstTurnTime')?.value;
    const lastTurnTimeStr = this.firstFormGroup.get('lastTurnTime')?.value;

    // check if the values are valid
    if (
      typeof turnDuration !== 'number' ||
      isNaN(turnDuration) ||
      !firstTurnTimeStr ||
      !lastTurnTimeStr
    ) {
      return;
    }

    // clear the turns array
    this.turns = [];
    this.auxTurns = []; // Array to store the auxiliary turns

    // iterate over the selected days
    const selectedDays = this.firstFormGroup.get('weekDays')?.value;
    for (const day of selectedDays) {
      // get the number of turns per day
      this.numberOfTurns = this.calculateTurnsPerDay();
      // Check if the number of turns calculation was successful
      if (this.numberOfTurns === -1) {
        console.error('No se pudieron calcular los turnos para el día:', day);
        return;
      }

      // Cast the firstTurnTimeStr string to a Date object
      const startTime = new Date(`2022-01-01T${firstTurnTimeStr}`);
      for (let i = 0; i < this.numberOfTurns; i++) {
        // Create a turn object with the turn number and display time
        const turno: Turn = {
          day: day,
          startTime: (i + 1).toString(), // Guardar el número del turno
          displayTime: startTime.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          }), // Hora de inicio para mostrar en el HTML
        };
        // Add the turn to the turns array
        this.turns.push(turno);

        // increment the startTime by the turnDuration
        startTime.setMinutes(startTime.getMinutes() + turnDuration);
      }
    }
    this.firstFormGroup.patchValue({ numberOfTurns: this.numberOfTurns });
    this.secondFormGroup.patchValue({ turns: this.turns });
    this.createTimeTable();
  }

  // Function to handle the selection of a turn
  onSelectionChange(turn: Turn) {
    // Verify if the turn is already selected
    const index = this.turns.findIndex(
      (t) => t.day === turn.day && t.startTime === turn.startTime
    );

    if (index !== -1) {
      // Toggle the is_free_time property
      this.turns[index].is_free_time = !this.turns[index].is_free_time;
    } else {
      console.error('Turno no encontrado:', turn);
    }
    this.secondFormGroup.patchValue({ turns: this.turns });
    console.log('length', this.turns.length);
    console.log('selected', this.selectedTurns.length);
    console.log('antes de entrar', this.allDaysSelected);
    this.showAlertIfAllDaysSelected();
    console.log('despues', this.allDaysSelected);
  }

  spaceCards: Space[] = [];
  workerCards: Worker[] = [];
  taskCards: ScheduableTask[] = [];
  // Function to open the space dialog
  openSpaceDialog(space?: Space) {
    let spaceName: string;
    let dialogRef;
    if (space) {
      spaceName = space.name;
      dialogRef = this.dialog.open(SpaceDialogComponent, {
        data: {
          spaceName: space.name,
          spaceCapacity: space.spaceCapacity,
          turns: this.turns,
          restrictionTurns: space.restrictionsSpace,
          eliminate: this.deleteSpace.bind(this),
        },
      });
    } else {
      dialogRef = this.dialog.open(SpaceDialogComponent, {
        data: {
          space: null,
          turns: this.turns,
          eliminate: this.deleteSpace.bind(this),
        },
      });
    }

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Create a new space object with the dialog result
        const newSpace: Space = {
          name: result.name,
          spaceCapacity: result.spaceCapacity,
          restrictionsSpace: result.restrictionsSpace,
        };

        if (space) {
          // If the worker was provided (modification case), find its index
          const existingSpaceIndex = this.spaces.findIndex(
            (s) => s.name === space.name
          );

          if (existingSpaceIndex !== -1) {
            // Update the existing worker
            this.spaces[existingSpaceIndex] = newSpace;
          }
        } else {
          // If no worker was provided (creation case), add the new worker
          this.spaces.push(newSpace);
        }

        this.loadSpaceCards();
      }
    });
  }

  openWorkerDialog(worker?: Worker) {
    // let workerName: string;

    let dialogRef;
    if (worker) {
      // workerName = worker.name;
      dialogRef = this.dialog.open(WorkerDialogComponent, {
        data: {
          workerName: worker.name,
          turns: this.turns,
          restrictionTurns: worker.restrictionsWorker,
          eliminate: this.deleteWorker.bind(this),
        },
      });
    } else {
      dialogRef = this.dialog.open(WorkerDialogComponent, {
        data: {
          worker: null,
          turns: this.turns,
          eliminate: this.deleteWorker.bind(this),
        },
      });
    }

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Create a new worker object with the dialog result
        const newWorker: Worker = {
          name: result.name,
          restrictionsWorker: result.restrictionsWorker,
        };

        if (worker) {
          // If the worker wa s provided (modification case), find its index
          const existingWorkerIndex = this.workers.findIndex(
            (w) => w.name === worker.name
          );

          if (existingWorkerIndex !== -1) {
            // Update the existing worker
            this.workers[existingWorkerIndex] = newWorker;
          }
        } else {
          // If no worker was provided (creation case), add the new worker
          this.workers.push(newWorker);
        }

        this.loadWorkerCards();
      }
    });
  }

  openTagsDialog() {
    let dialogRef = this.dialog.open(TagsDialogComponent, {
      data: {
        tags: this.taskTags,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('result', result);
      const auxTag: Tag = { name: '' };
      auxTag.name = result.name;
      this.loadTags(auxTag);
    });
  }
  openScheduableTaskDialog(scheduableTask?: ScheduableTask) {
    let dialogRef;

    if (scheduableTask) {
      dialogRef = this.dialog.open(ScheduableTaskDialogComponent, {
        data: {
          taskName: scheduableTask.name,
          taskSize: scheduableTask.size,
          turns: this.turns,
          dataWorkers: this.workers,
          dataSpaces: this.spaces,
          datatags: this.availableTags,
          scheduableTask: scheduableTask,
        },
      });
    } else {
      dialogRef = this.dialog.open(ScheduableTaskDialogComponent, {
        data: {
          taskName: null,
          turns: this.turns,
          dataWorkers: this.workers,
          dataSpaces: this.spaces,
          datatags: this.availableTags,
        },
      });
    }

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newTask: ScheduableTask = {
          name: result.name,
          size: result.taskSize,
          restrictions: result.restrictions,
          taskWorker: result.workers,
          taskSpace: result.spaces,
          taskTags: result.tags,
        };

        if (scheduableTask) {
          // If the worker was provided (modification case), find its index
          const existingtaskIndex = this.scheduableTasks.findIndex(
            (t) => t.name === scheduableTask.name
          );

          if (existingtaskIndex !== -1) {
            // Update the existing worker
            this.scheduableTasks[existingtaskIndex] = newTask;
          }
        } else {
          // If no worker was provided (creation case), add the new worker
          this.scheduableTasks.push(newTask);
        }

        this.loadTaskCards();
      }
    });
  }

  // Function to load the space cards in card list form the spaces array
  loadSpaceCards(): void {
    // delete the existing space cards
    this.spaceCards = [];

    if (this.spaces.length === 0) {
      this.snackBar.open('Debes introducir al menos un espacio', 'Quitar', {
        duration: 5000,
      });
    }

    // iterate over the spaces array and create a card for each space
    this.spaces.forEach((space: Space) => {
      // Create a new card object with the space data
      const newCard = {
        name: space.name,
        spaceCapacity: space.spaceCapacity,
        restrictionsSpace: space.restrictionsSpace,
      };

      // Add the card to the spaceCards array
      this.spaceCards.push(newCard);
    });
  }

  loadWorkerCards(): void {
    // delete the existing worker cards
    this.workerCards = [];

    if (this.workers.length === 0) {
      this.snackBar.open('Debes introducir al menos un trabajador', 'Quitar', {
        duration: 5000,
      });
    }

    // iterate over the workers array and create a card for each worker
    this.workers.forEach((worker: Worker) => {
      // Create a new card object with the worker data
      const newCard = {
        name: worker.name,
        restrictionsWorker: worker.restrictionsWorker,
      };

      // Add the card to the workerCards array
      this.workerCards.push(newCard);
    });
  }

  loadTags(newTag: Tag): void {
    // Add the card to the workerCards array
    this.taskTags.push(newTag);
    this.availableTags.push(newTag);
  }

  loadTaskCards(): void {
    // delete the existing space cards
    this.taskCards = [];

    if (this.scheduableTasks.length === 0) {
      this.snackBar.open('Debes introducir al menos una tarea', 'Quitar', {
        duration: 5000,
      });
    }

    // iterate over the spaces array and create a card for each space
    this.scheduableTasks.forEach((task: ScheduableTask) => {
      // Create a new card object with the space data
      const newCard = {
        name: task.name,
        size: task.size,
        restrictions: task.restrictions,
        taskWorker: task.taskWorker,
        taskSpace: task.taskSpace,
        taskTags: task.taskTags,
      };

      // Add the card to the spaceCards array
      this.taskCards.push(newCard);
    });
  }

  // Function to delete a space from the spaces array and reload the space cards
  deleteSpace(deleteSpace: String): void {
    // Find the index of the space to delete
    const index = this.spaces.findIndex((space) => space.name === deleteSpace);

    // Delete the space from the spaces array
    this.spaces.splice(index, 1);

    // Reload the space cards
    this.loadSpaceCards();
  }

  deleteWorker(deleteWorker: String): void {
    // Find the index of the worker to delete
    const index = this.workers.findIndex(
      (worker) => worker.name === deleteWorker
    );

    // Delete the worker from the workers array
    this.workers.splice(index, 1);

    // Reload the worker cards
    this.loadWorkerCards();
  }

  deleteTask(deleteTask: String): void {
    // Find the index of the worker to delete
    const index = this.scheduableTasks.findIndex(
      (task) => task.name === deleteTask
    );

    // Delete the worker from the workers array
    this.scheduableTasks.splice(index, 1);

    // Reload the worker cards
    this.loadTaskCards();
  }

  // --------Api calls methods----------
  createTimeTable() {
    const data = {
      name: this.firstFormGroup.get('scheduleName')?.value,
      turnsDuration: this.firstFormGroup.get('turnDuration')?.value,
      turnsPerDay: this.firstFormGroup.get('numberOfTurns')?.value,
      start_time: this.firstFormGroup.get('firstTurnTime')?.value,
      user_id: parseInt(localStorage.getItem('userId') ?? '', 0),
    };

    this.schedulerASP.createTimeTable(data).subscribe(
      (response) => {
        console.log('Response:', response.id);
        this.apiTimeTable = response;
        localStorage.setItem(
          'timetable_id',
          this.apiTimeTable.id.toString() ?? ''
        );
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  createAllTurns() {
    const auxTurn = this.secondFormGroup.get('turns')?.value ?? [];

    const data = auxTurn.map((turn: Turn) => {
      return {
        day: turn.day,
        startTime: turn.startTime,
        is_free_time: turn.is_free_time,
        timeTable_id: this.apiTimeTable.id,
      };
    });

    this.schedulerASP.createAllTurns(data).subscribe(
      (response) => {
        console.log('Response:', response);
        this.apiTurns = response;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  getAllCommonSpaces() {
    this.schedulerASP.getCommonSpacesByUserId().subscribe(
      (response) => {
        this.apiSpaces = response;
        this.apiSpaces.forEach((apiSpace) => {
          let auxIds: number[] = [];

          auxIds = apiSpace.restrictionsSpace;

          const newSpace: Space = {
            name: apiSpace.name,
            spaceCapacity: apiSpace.space_capacity,
            restrictionsSpace: [],
          };
          this.spaces.push(newSpace);
        });
        this.loadSpaceCards();
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  createAllSpacesAndCommonSpace() {
    const auxSpace = this.thirdFormGroup.get('spaces')?.value ?? [];

    const differentSpaces = auxSpace.filter((space: Space) => {
      return !this.apiSpaces.some((apiSpace) => apiSpace.name === space.name);
    });

    const data = auxSpace.map((space: Space) => {
      return {
        name: space.name,
        space_capacity: space.spaceCapacity,
        restrictionsSpace: space.restrictionsSpace.map((turn) => {
          return this.apiTurns.find(
            (apiTurn) =>
              apiTurn.day === turn.day && apiTurn.startTime === turn.startTime
          )?.id;
        }),
        timeTable_id: this.apiTimeTable.id,
      };
    });

    const data2 = differentSpaces.map((space: Space) => {
      return {
        name: space.name,
        space_capacity: space.spaceCapacity,
        user_id: localStorage.getItem('userId'),
      };
    });

    this.schedulerASP.createAllCommonSpace(data2).subscribe(
      (response) => {
        console.log('Response:', response);
      },
      (error) => {
        console.error('Error:', error);
      }
    );

    this.schedulerASP.createAllSpace(data).subscribe(
      (response) => {
        console.log('Response:', response);
        this.apiSpaces = response;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  getAllCommonWorkers() {
    this.schedulerASP.getCommonWorkersByUserId().subscribe(
      (response) => {
        console.log('Response all common workers:', response);
        this.apiWorkers = response;
        this.apiWorkers.forEach((apiWorker) => {
          let auxIds: number[] = [];

          auxIds = apiWorker.restrictionsWorker;

          const newWorker: Worker = {
            name: apiWorker.name,
            restrictionsWorker: [],
          };
          this.workers.push(newWorker);
        });
        this.loadWorkerCards();
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  createAllWorkersAndCommonWorkers() {
    const auxWorker = this.fourthFormGroup.get('workers')?.value ?? [];

    const differentWorkers = auxWorker.filter((worker: Worker) => {
      return !this.apiWorkers.some(
        (apiWorker) => apiWorker.name === worker.name
      );
    });
    const data = auxWorker.map((worker: Worker) => {
      return {
        name: worker.name,
        restrictionsWorker: worker.restrictionsWorker.map((turn) => {
          return this.apiTurns.find(
            (apiTurn) =>
              apiTurn.day === turn.day && apiTurn.startTime === turn.startTime
          )?.id;
        }),
        timeTable_id: this.apiTimeTable.id,
      };
    });

    const data2 = differentWorkers.map((worker: Worker) => {
      return {
        name: worker.name,
        user_id: localStorage.getItem('userId'),
      };
    });

    this.schedulerASP.createAllCommonWorkers(data2).subscribe(
      (response) => {
        console.log('Response:', response);
      },
      (error) => {
        console.error('Error:', error);
      }
    );

    this.schedulerASP.createAllWorker(data).subscribe(
      (response) => {
        console.log('Response:', response);
        this.apiWorkers = response;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  getAllCommonTasks() {
    this.schedulerASP.getCommonTasksByUserId().subscribe(
      (response) => {
        console.log('Response all common task:', response);
        this.apiScheduableTasks = response;
        this.apiScheduableTasks.forEach((apiTask) => {
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

  createAllTasksAndCommonTasks() {
    const auxTask = this.fithFormGroup.get('scheduableTasks')?.value ?? [];

    const differentTasks = auxTask.filter((task: ScheduableTask) => {
      return !this.apiScheduableTasks.some(
        (apiTask) => apiTask.name === task.name
      );
    });

    const task_worker = this.apiWorkers?.map((worker) => {
      return this.apiWorkers.find((apiWorker) => apiWorker.name === worker.name)
        ?.id;
    });

    const data = auxTask.map((task: ScheduableTask) => {
      return {
        name: task.name,
        task_size: task.size,
        task_restrictions: task.restrictions?.map((turn) => {
          return this.apiTurns.find(
            (apiTurn) =>
              apiTurn.day === turn.day && apiTurn.startTime === turn.startTime
          )?.id;
        }),
        task_tags: task.taskTags,
        task_worker: this.apiWorkers.find(
          (apiWorker) => apiWorker.name === (task.taskWorker?.[0]?.name ?? null)
        )?.id,
        task_spaces: this.apiSpaces.find(
          (apiSpace) => apiSpace.name === (task.taskSpace?.[0]?.name ?? null)
        )?.id,
        timeTable_id: this.apiTimeTable.id,
      };
    });

    const data2 = differentTasks.map((task: ScheduableTask) => {
      return {
        name: task.name,
        user_id: localStorage.getItem('userId'),
      };
    });

    this.schedulerASP.createAllCommonTasks(data2).subscribe(
      (response) => {
        console.log('Response:', response);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
    this.schedulerASP.createAllscheduableTasks(data).subscribe(
      (response) => {
        console.log('Response:', response);
        this.apiScheduableTasks = response;
        this.getGeneratedSchedules();
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  getGeneratedSchedules() {
    this.router.navigate(['/generatedCalendar']);
  }

  cleanSpaces() {
    this.spaces = [];
    this.loadSpaceCards();
  }
  cleanWorkers() {
    this.workers = [];
    this.loadWorkerCards();
  }

  cleanTasks() {
    this.scheduableTasks = [];
    this.loadTaskCards();
  }

  first: boolean = true;

  endform(first?: boolean) {
    if (!first) {
      this.schedulerASP.deleteTimetable(this.apiTimeTable.id).subscribe(
        (response) => {
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    } else {
      this.router.navigate(['/']);
    }
  }

  constructor(
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private schedulerASP: schedulerASP,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
}
