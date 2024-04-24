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

  // Form Steps

  // First formStep
  firstFormGroup = this._formBuilder.group({
    // firstCtrl: ['', Validators.required],
    nombreHorario: ['', Validators.required],
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

  addItemDayTimeRestriction() {
    const weekDaysRestrictionValue = this.weekDaysRestriction.value;
    const dayTimerestrictionControl =
      this.firstFormGroup.get('dayTimerestriction');

    // Verificar si dayTimerestrictionControl no es null
    if (weekDaysRestrictionValue && dayTimerestrictionControl) {
      const dayTimerestrictionValue = dayTimerestrictionControl.value;
      const newItem = `${weekDaysRestrictionValue}, ${dayTimerestrictionValue}`;
      this.items.push(newItem);

      // Limpiar los controles después de agregar un elemento
      this.weekDaysRestriction.reset();
      dayTimerestrictionControl.reset();
    }
  }
  onRightClick(event: MouseEvent, item: string) {
    event.preventDefault();
    const index = this.items.indexOf(item);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  constructor(private _formBuilder: FormBuilder) {}
}
