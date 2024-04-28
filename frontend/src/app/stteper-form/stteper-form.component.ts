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

export interface Turn {
  day: String;
  startTime: String;
}

export interface Space {
  name: String;
  spaceCapacity: number;
  restrictionsSpace: Turn[];
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
  weekDaysRestriction = new FormControl();
  turns: Turn[] = [];
  selectedTurns: Turn[] = [];
  spaces: Space[] = [];

  // Form Steps

  // First formStep
  firstFormGroup = this._formBuilder.group({
    scheduleName: ['', Validators.required],
    weekDays: this.weekDays,
    turnDuration: ['', Validators.required],
    firstTurnTime: ['', Validators.required],
    lastTurnTime: ['', Validators.required],
    weekDaysRestriction: this.weekDaysRestriction,
    dayTimerestriction: ['', Validators.required],
  });
  // First formStep
  secondFormGroup = this._formBuilder.group({
    selectedTurns: [this.selectedTurns, Validators.required],
  });

  thirdFormGroup = this._formBuilder.group({
    spaces: [this.spaces, Validators.required],
  });
  isLinear = false;

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
      const numberOfTurns = this.calculateTurnsPerDay();

      // Check if the number of turns caculation was successful
      if (numberOfTurns === -1) {
        console.error('No se pudieron calcular los turnos para el día:', day);
        return;
      }

      // Cast the firstTurnTimeStr string to a Date object
      const startTime = new Date(`2022-01-01T${firstTurnTimeStr}`);
      for (let i = 0; i < numberOfTurns; i++) {
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

    console.log('Turnos llenados:', this.turns);
  }

  // Function to handle the selection of a turn
  onSelectionChange(turn: Turn) {
    // Verify if the turn is already selected
    const index = this.selectedTurns.findIndex(
      (t) => t.day === turn.day && t.startTime === turn.startTime
    );

    if (index === -1) {
      // if it is not selected, add it to the list
      this.selectedTurns.push(turn);
    } else {
      // if it is selected, remove it from the list
      this.selectedTurns.splice(index, 1);
    }

    console.log('Selected turns:', this.selectedTurns);
  }

  // Function to open the space dialog
  openSpaceDialog() {
    const dialogRef = this.dialog.open(SpaceDialogComponent, {
      data: this.turns,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.spaces.push(result);
      console.log('Spaces:', this.spaces);
      for (let i = 0; i < this.spaces.length; i++) {
        console.log('Spaces:', this.spaces[i].name);
        console.log('Spaces:', this.spaces[i].spaceCapacity);
        console.log('Spaces:', this.spaces[i].restrictionsSpace);
      }
    });
  }

  constructor(private _formBuilder: FormBuilder, public dialog: MatDialog) {}
}
