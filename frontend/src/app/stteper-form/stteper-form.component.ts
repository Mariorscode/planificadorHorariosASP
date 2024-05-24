import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SpaceDialogComponent } from '../dialog/spaceDialog/spaceDialog/spaceDialog.component';
import { WorkerDialogComponent } from '../dialog/workerDialog/workerDialog/workerDialog.component';
import { TagsDialogComponent } from '../dialog/tagsDialog/tagsDialog/tagsDialog.component';
import { ScheduableTaskDialogComponent } from '../dialog/scheduableTaskDialog/scheduableTaskDialog/scheduableTaskDialog.component';
import { co, s } from '@fullcalendar/core/internal-common';
import { StteperFormService } from './stteper-form.service';
import { empty } from 'rxjs';
export interface Turn {
  day: String;
  startTime: String;
  is_free_time?: boolean;
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
  restrictions: Turn[];
  taskWorker: Worker[];
  taskSpace: Space[];
  taskTags: Tag[];
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
  userid: number = 1;

  daysOfWeek: string[] = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];
  weekDays = new FormControl();
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

  turnsPrueba: Turn[] = [{ day: 'Lunes', startTime: '17:00' }];

  // spaces: Space[] = [
  //   {
  //     name: 'Space 1',
  //     spaceCapacity: 10,
  //     restrictionsSpace: [{ day: 'Lunes', startTime: '08:00' }],
  //   },
  //   {
  //     name: 'Space 2',
  //     spaceCapacity: 10,
  //     restrictionsSpace: [{ day: 'Lunes', startTime: '08:00' }],
  //   },
  // ];

  spaces: Space[] = [];

  workers: Worker[] = [
    {
      name: 'John Doe',
      restrictionsWorker: [{ day: 'Lunes', startTime: '08:00' }],
    },
    {
      name: 'Jane Doe',
      restrictionsWorker: [{ day: 'Lunes', startTime: '10:00' }],
    },
  ];

  availableTags: Tag[] = [
    {
      name: 'Tag 1',
    },
    {
      name: 'Tag 2',
    },
    {
      name: 'Tag 3',
    },
  ];
  taskTags: Tag[] = [];
  scheduableTasks: ScheduableTask[] = [
    {
      name: 'Calculo1',
      size: 10,
      restrictions: [{ day: 'Lunes', startTime: '08:00' }],
      taskWorker: [
        {
          name: 'John Doe',
          restrictionsWorker: [{ day: 'Lunes', startTime: '08:00' }],
        },
      ],
      taskSpace: [
        {
          name: 'Space 1',
          spaceCapacity: 10,
          restrictionsSpace: [{ day: 'Lunes', startTime: '08:00' }],
        },
      ],

      taskTags: [{ name: 'Grupo A' }, { name: 'primero' }, { name: 'teoria' }],
    },
    {
      name: 'Calculo2',
      size: 10,
      restrictions: [{ day: 'Lunes', startTime: '08:00' }],
      taskWorker: [
        {
          name: 'John Doe',
          restrictionsWorker: [{ day: 'Lunes', startTime: '08:00' }],
        },
      ],
      taskSpace: [
        {
          name: 'Space 1',
          spaceCapacity: 10,
          restrictionsSpace: [{ day: 'Lunes', startTime: '08:00' }],
        },
      ],

      taskTags: [{ name: 'Grupo A' }, { name: 'primero' }, { name: 'teoria' }],
    },
  ];

  //-------------------- Form Steps --------------------

  // First formStep
  firstFormGroup = this._formBuilder.group({
    scheduleName: ['', Validators.required],
    weekDays: this.weekDays,
    turnDuration: ['', Validators.required],
    firstTurnTime: ['', Validators.required],
    lastTurnTime: ['', Validators.required],
    weekDaysRestriction: this.weekDaysRestriction,
    dayTimerestriction: ['', Validators.required],
    numberOfTurns: this.numberOfTurns,
  });
  // Second formStep
  secondFormGroup = this._formBuilder.group({
    turns: [this.turns, Validators.required],
    // selectedTurns: [this.selectedTurns, Validators.required],
  });
  // Third formStep
  thirdFormGroup = this._formBuilder.group({
    spaces: [this.spaces, Validators.required],
  });
  // Fourth formStep
  fourthFormGroup = this._formBuilder.group({
    workers: [this.workers, Validators.required],
  });
  fithFormGroup = this._formBuilder.group({
    scheduableTasks: [this.scheduableTasks, Validators.required],
  });

  isLinear = false;

  //--------------------/Form Steps --------------------

  //-------------------- Methods --------------------

  // excute at the load of the component
  ngOnInit(): void {
    // load the space cards

    this.getAllTimetables();
    this.getAllCommonSpaces();
    this.loadWorkerCards();
    this.loadTaskCards();
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

    // Imprimir el resultado
    console.log(
      `Entre las ${firstTurnTimeStr} y ${lastTurnTimeStr} hay ${numberOfTurns} turnos de ${turnDuration} minutos.`
    );
    return numberOfTurns;
  }

  // Fill the turns array with the turns calculated from the form values
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
      console.error(
        'Los valores del formulario no son válidos para llenar los turnos.'
      );
      return;
    }

    //clear the turns array
    this.turns = [];

    // iterate over the selected days
    const selectedDays = this.weekDays.value;
    for (const day of selectedDays) {
      // get the number of turns per day
      this.numberOfTurns = this.calculateTurnsPerDay();
      // Check if the number of turns caculation was successful
      if (this.numberOfTurns === -1) {
        console.error('No se pudieron calcular los turnos para el día:', day);
        return;
      }

      // Cast the firstTurnTimeStr string to a Date object
      const startTime = new Date(`2022-01-01T${firstTurnTimeStr}`);
      for (let i = 0; i < this.numberOfTurns; i++) {
        // Create a turn object
        const turno: Turn = {
          day: day,
          startTime: startTime.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          }),
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
    console.log('Turnos llenados:', this.turns);
  }

  // Function to handle the selection of a turn
  onSelectionChange(turn: Turn) {
    // Verify if the turn is already selected
    console.log('Turn:', turn);
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
    console.log('Selected turns:', this.turns);
  }

  spaceCards: Space[] = [];
  workerCards: Worker[] = [];
  taskCards: ScheduableTask[] = [];
  // Function to open the space dialog
  openSpaceDialog(space?: Space) {
    let spaceName: string;
    console.log('AAAAAAAAAAAA', this.secondFormGroup.get('turns')?.value);
    let dialogRef;
    if (space) {
      spaceName = space.name;
      dialogRef = this.dialog.open(SpaceDialogComponent, {
        data: {
          spaceName: spaceName,
          turns: this.turns,
          eliminate: this.deleteSpace.bind(this),
        },
      });
    } else {
      dialogRef = this.dialog.open(SpaceDialogComponent, {
        data: {
          spaceName: null,
          turns: this.turns,
          eliminate: this.deleteSpace.bind(this),
        },
      });
    }

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');

      if (result) {
        // Create a new space object with the dialog result
        const newSpace: Space = {
          name: result.name,
          spaceCapacity: result.spaceCapacity,
          restrictionsSpace: result.restrictionsSpace,
        };

        // check if the space already exists
        const existingSpaceIndex = this.spaceCards.findIndex(
          (spaceCards) => spaceCards.name === newSpace.name
        );

        if (existingSpaceIndex !== -1) {
          //in case the space already exists, update the space
          this.spaces[existingSpaceIndex] = newSpace;
        } else {
          // if the space does not exist, add it to the spaces array
          this.spaces.push(newSpace);
        }
        this.loadSpaceCards();
      }
      console.log('Todas las spaces:', this.spaces);
    });
  }

  openWorkerDialog(worker?: Worker) {
    let workerName: string;

    let dialogRef;
    if (worker) {
      workerName = worker.name;
      dialogRef = this.dialog.open(WorkerDialogComponent, {
        data: {
          workers: this.workers,
          turns: this.turns,

          eliminate: this.deleteWorker.bind(this),
        },
      });
    } else {
      dialogRef = this.dialog.open(WorkerDialogComponent, {
        data: {
          workerName: null,
          turns: this.turns,
          eliminate: this.deleteWorker.bind(this),
        },
      });
    }

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');

      if (result) {
        // Create a new worker object with the dialog result
        const newWorker: Worker = {
          name: result.name,
          restrictionsWorker: result.restrictionsWorker,
        };

        // check if the worker already exists
        const existingWorkerIndex = this.workerCards.findIndex(
          (workerCards) => workerCards.name === newWorker.name
        );

        if (existingWorkerIndex !== -1) {
          //in case the worker already exists, update the worker
          this.workers[existingWorkerIndex] = newWorker;
        } else {
          // if the worker does not exist, add it to the workers array
          this.workers.push(newWorker);
        }
        this.loadWorkerCards();
      }
      console.log('Todas las workers:', this.workers);
    });
  }

  openTagsDialog() {
    let dialogRef = this.dialog.open(TagsDialogComponent, {
      data: {
        spaceName: this.firstFormGroup.get('scheduleName')?.value,
        eliminate: this.deleteSpace.bind(this),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('RESULTADO TAGS', result);
      this.loadTags(result);
      // console.log('Todas las tags:', this.tags);
    });
  }
  openScheduableTaskDialog(scheduableTask?: ScheduableTask) {
    let dialogRef;

    if (scheduableTask) {
      dialogRef = this.dialog.open(ScheduableTaskDialogComponent, {
        data: {
          taskName: scheduableTask.name,
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
      console.log('RESULTADO ', result);
      if (result) {
        const newTask: ScheduableTask = {
          name: result.name,
          size: result.taskSize,
          restrictions: result.restrictions,
          taskWorker: result.workers,
          taskSpace: result.spaces,
          taskTags: result.tags,
        };

        // check if the space already exists
        const existingTaskIndex = this.scheduableTasks.findIndex(
          (task) => task.name === newTask.name
        );
        // this.scheduableTasks.push(newTask);

        if (existingTaskIndex !== -1) {
          //in case the space already exists, update the space
          this.scheduableTasks[existingTaskIndex] = newTask;
          console.log('44444444444444:', this.scheduableTasks);
        } else {
          // if the space does not exist, add it to the spaces array
          this.scheduableTasks.push(newTask);
        }
        this.loadTaskCards();
      }
      console.log('Todas las task:', this.scheduableTasks);
    });
  }

  // Function to load the space cards in card list form the spaces array
  loadSpaceCards(): void {
    // delete the existing space cards
    this.spaceCards = [];

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
      console.log('todas Space cards:', this.spaceCards);
    });
  }

  loadWorkerCards(): void {
    // delete the existing worker cards
    this.workerCards = [];

    // iterate over the workers array and create a card for each worker
    this.workers.forEach((worker: Worker) => {
      // Create a new card object with the worker data
      const newCard = {
        name: worker.name,
        restrictionsWorker: worker.restrictionsWorker,
      };

      // Add the card to the workerCards array
      this.workerCards.push(newCard);
      console.log('todas Worker cards:', this.workerCards);
    });
  }

  loadTags(tags: Tag[]): void {
    // iterate over the workers array and create a card for each worker
    tags.forEach((tag: Tag) => {
      // Create a new card object with the worker data
      const newTag = {
        name: tag.name,
      };

      // Add the card to the workerCards array
      this.taskTags.push(newTag);
      this.availableTags.push(newTag);
      console.log('todas TAGS', this.taskTags);
    });
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
        restrictions: task.restrictions,
        taskWorker: task.taskWorker,
        taskSpace: task.taskSpace,
        taskTags: task.taskTags,
      };

      // Add the card to the spaceCards array
      this.taskCards.push(newCard);
      console.log('todas task cards:', this.taskCards);
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
    };

    console.log('data sent timetable:', data);

    this.stteperFormService.createTimeTable(data).subscribe(
      (response) => {
        console.log('Response Timetable:', response);
        this.apiTimeTable = response;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  getAllTimetables() {
    this.stteperFormService.getAllTimetables().subscribe(
      (response) => {
        console.log('Response all timetables:', response);
        this.apiTimeTable = response;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  createAllTurns() {
    console.log('turns:', this.secondFormGroup.get('turns')?.value);

    // const data: Turn[] | null | undefined =
    //   this.secondFormGroup.get('turns')?.value;

    const auxTurn = this.secondFormGroup.get('turns')?.value ?? [];

    const data = auxTurn.map((turn: Turn) => {
      return {
        day: turn.day,
        startTime: turn.startTime,
        is_free_time: turn.is_free_time,
        timeTable_id: this.apiTimeTable.id,
      };
    });

    console.log('data sent turns:', data);

    this.stteperFormService.createAllTurns(data).subscribe(
      (response) => {
        console.log('Response:', response);
        this.apiTurns = response;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  // getAllSpaces() {
  //   this.stteperFormService.getAllSpaces().subscribe(
  //     (response) => {
  //       console.log('Response all spaces:', response);

  //       this.apiSpaces = response;
  //       console.log('API SPACES:', this.apiSpaces);

  //       this.apiSpaces.forEach((apiSspace) => {
  //         let auxIds: number[] = [];

  //         auxIds = apiSspace.restrictionsSpace;
  //         console.log('AUX IDS:', auxIds);

  //         let auxRestrictionSpace: Turn[] = [];
  //         auxIds.forEach((id) => {
  //           const turn = this.apiTurns.find((apiTurn) => apiTurn.id === id);
  //           console.log('API TURN:', turn);
  //           if (turn) {
  //             console.log('TURN:', turn);
  //             auxRestrictionSpace.push(turn);
  //           }
  //         });

  //         const newSpace: Space = {
  //           name: apiSspace.name,
  //           spaceCapacity: apiSspace.space_capacity,
  //           restrictionsSpace: auxRestrictionSpace,
  //         };
  //         console.log('NEW SPACE:', newSpace);
  //         this.spaces.push(newSpace);
  //       });
  //     },
  //     (error) => {
  //       console.error('Error:', error);
  //     }
  //   );
  // }

  getAllCommonSpaces() {
    this.stteperFormService.getAllCommonSpaces().subscribe(
      (response) => {
        console.log('Response all common spaces:', response);
        this.apiSpaces = response;
        this.apiSpaces.forEach((apiSpace) => {
          let auxIds: number[] = [];

          auxIds = apiSpace.restrictionsSpace;
          console.log('AUX IDS:', auxIds);

          const newSpace: Space = {
            name: apiSpace.name,
            spaceCapacity: apiSpace.space_capacity,
            restrictionsSpace: [],
          };
          console.log('NEW SPACE:', newSpace);
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
    console.log('turns:', this.secondFormGroup.get('turns')?.value);

    // const data: Turn[] | null | undefined =
    //   this.secondFormGroup.get('turns')?.value;

    const auxSpace = this.thirdFormGroup.get('spaces')?.value ?? [];

    const differentSpaces = auxSpace.filter((space: Space) => {
      return !this.apiSpaces.some((apiSpace) => apiSpace.name === space.name);
    });
    console.log('Different Spaces:', differentSpaces);

    const data = auxSpace.map((space: Space) => {
      console.log('EEEEEEEEEEE:', space.restrictionsSpace);
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
        user_id: this.userid,
      };
    });

    console.log('data sent sapce:', data);

    this.stteperFormService.createAllCommonSpace(data2).subscribe(
      (response) => {
        console.log('Response:', response);
      },
      (error) => {
        console.error('Error:', error);
      }
    );

    this.stteperFormService.createAllSpace(data).subscribe(
      (response) => {
        console.log('Response:', response);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  // --------/Api calls methods----------

  constructor(
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private stteperFormService: StteperFormService
  ) {}
}
