import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { ThemePalette } from '@angular/material/core';
import { scheduled } from 'rxjs';

interface Turn {
  day: String;
  startTime: String;
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
  items: string[] = [];
  turns: Turn[] = [];

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
    secondCtrl: ['', Validators.required],
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

  constructor(private _formBuilder: FormBuilder) {}
}
