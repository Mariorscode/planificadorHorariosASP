import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';

import {
  ScheduableTask,
  Space,
  Turn,
  Tag,
  Worker,
} from 'src/app/stteper-form/stteper-form.component';

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
  isCommon = this.data.isCommon || false;

  availableTags: Tag[] = this.data.datatags;

  scheduableTaskForm = this.fb.group({
    name: [this.data.taskName || '', Validators.required],
    taskSize: [this.data.taskSize || 0, Validators.required],

    restrictions: [this.restrictions],
    workers: [this.workers],
    spaces: [this.spaces],
    tags: [this.tags],
  });

  constructor(
    public dialogRef: MatDialogRef<ScheduableTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      taskName: string;
      taskSize: number;
      turns: Turn[];
      dataWorkers: Worker[];
      datatags: Tag[];
      dataSpaces: Space[];
      isCommon?: boolean;
    },
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Set the form value based on data
    this.scheduableTaskForm.get('name')?.setValue(this.data.taskName);
    this.scheduableTaskForm.get('taskSize')?.setValue(this.data.taskSize);
  }

  onSelectionTurn(turn: Turn) {
    const index = this.restrictions.findIndex(
      (t) => t.day === turn.day && t.startTime === turn.startTime
    );

    if (index === -1) {
      this.restrictions.push(turn);
    } else {
      this.restrictions.splice(index, 1);
    }
  }

  onSelectionWorker(worker: Worker) {
    const index = this.workers.findIndex((t) => t.name === worker.name);

    if (index === -1) {
      this.workers.push(worker);
    } else {
      this.workers.splice(index, 1);
    }
  }

  onSelectionSpace(space: Space) {
    const index = this.spaces.findIndex((t) => t.name === space.name);

    if (index === -1) {
      this.spaces.push(space);
    } else {
      this.spaces.splice(index, 1);
    }
  }

  onSelectionTag(tag: Tag) {
    const index = this.tags.findIndex((t) => t.name === tag.name);

    if (index === -1) {
      this.tags.push(tag);
    } else {
      this.tags.splice(index, 1);
    }
  }

  saveScheduableTask(): void {
    if (this.scheduableTaskForm.valid) {
      this.dialogRef.close(this.scheduableTaskForm.value);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
