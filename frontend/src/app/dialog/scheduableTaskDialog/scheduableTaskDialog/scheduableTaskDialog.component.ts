import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import {
  ScheduableTask,
  Space,
} from 'src/app/stteper-form/stteper-form.component';
import { Turn } from 'src/app/stteper-form/stteper-form.component';
import { Tag } from 'src/app/stteper-form/stteper-form.component';
import { Worker } from 'src/app/stteper-form/stteper-form.component';
@Component({
  selector: 'app-scheduableTaskDialog',
  templateUrl: './scheduableTaskDialog.component.html',
  styleUrls: ['./scheduableTaskDialog.component.css'],
})
export class ScheduableTaskDialogComponent {
  restrictions: Turn[] = [];
  tags: Tag[] = [];
  workers: Worker[] = [];
  spaces: Space[] = [];

  scheduableTaskForm = this.fb.group({
    name: ['', Validators.required],
    size: ['', Validators.required],
    restrictions: [this.restrictions, Validators.required],
    workers: [this.workers, Validators.required],
    spaces: [this.spaces, Validators.required],
    tags: [this.tags, Validators.required],
  });

  constructor(
    public dialogRef: MatDialogRef<ScheduableTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      taskName: ScheduableTask;
      turns: Turn[];
      dataWorkers: Worker[];
      datatags: Tag[];
      dataSpaces: Space[];
      // eliminate: (spaceToEliminate: String) => void;
    },
    private fb: FormBuilder
  ) {}

  onSelectionTurn(turn: Turn) {
    // Verify if the turn is already selected
    const index = this.restrictions.findIndex(
      (t) => t.day === turn.day && t.startTime === turn.startTime
    );

    if (index === -1) {
      // if it is not selected, add it to the list
      this.restrictions.push(turn);
    } else {
      // if it is selected, remove it from the list
      this.restrictions.splice(index, 1);
    }
  }
  onSelectionWorker(worker: Worker) {
    // Verify if the worker is already selected
    const index = this.workers.findIndex((t) => t.name === worker.name);

    if (index === -1) {
      // if it is not selected, add it to the list
      this.workers.push(worker);
    } else {
      // if it is selected, remove it from the list
      this.workers.splice(index, 1);
    }
  }
  onSelectionSpace(space: Space) {
    // Verify if the worker is already selected
    const index = this.spaces.findIndex((t) => t.name === space.name);

    if (index === -1) {
      // if it is not selected, add it to the list
      this.spaces.push(space);
    } else {
      // if it is selected, remove it from the list
      this.spaces.splice(index, 1);
    }
  }
  saveScheduableTask(): void {
    this.dialogRef.close(this.scheduableTaskForm.value);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
