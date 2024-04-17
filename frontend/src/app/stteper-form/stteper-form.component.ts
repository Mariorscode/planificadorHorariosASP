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

// export interface Task {
//   name: string;
//   completed: boolean;
//   color: ThemePalette;
//   subtasks?: Task[];
// }

@Component({
  selector: 'app-stteper-form',
  templateUrl: './stteper-form.component.html',
  styleUrls: ['./stteper-form.component.css'],
})
export class StteperFormComponent {
  // task: Task = {
  //   name: 'Indeterminate',
  //   completed: false,
  //   color: 'primary',

  //   subtasks: [
  //     { name: 'Primary', completed: false, color: 'primary' },
  //     { name: 'Accent', completed: false, color: 'accent' },
  //     { name: 'Warn', completed: false, color: 'warn' },
  //   ],
  // };
  // allComplete: boolean = false;
  // daysOfWeek: string[] = [
  //   'Lunes',
  //   'Martes',
  //   'Miércoles',
  //   'Jueves',
  //   'Viernes',
  //   'Sábado',
  //   'Domingo',
  // ];

  // updateAllComplete() {
  //   this.allComplete =
  //     this.task.subtasks != null &&
  //     this.task.subtasks.every((t) => t.completed);
  // }

  // someComplete(): boolean {
  //   if (this.task.subtasks == null) {
  //     return false;
  //   }
  //   return (
  //     this.task.subtasks.filter((t) => t.completed).length > 0 &&
  //     !this.allComplete
  //   );
  // }

  // setAll(completed: boolean) {
  //   this.allComplete = completed;
  //   if (this.task.subtasks == null) {
  //     return;
  //   }
  //   this.task.subtasks.forEach((t) => (t.completed = completed));
  // }

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
  firstFormGroup = this._formBuilder.group({
    // firstCtrl: ['', Validators.required],
    nombreHorario: ['', Validators.required],
    weekDays: this.weekDays,
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;

  constructor(private _formBuilder: FormBuilder) {}
}
