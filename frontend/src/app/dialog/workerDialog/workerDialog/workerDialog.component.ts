import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';

import { Turn } from 'src/app/stteper-form/stteper-form.component';

@Component({
  selector: 'app-workerDialog',
  templateUrl: './workerDialog.component.html',
  styleUrls: ['./workerDialog.component.css'],
})
export class WorkerDialogComponent {
  restrictionsWorker: Turn[] = [];
  isCommon = this.data.isCommon || false;

  workerForm = this.fb.group({
    name: [this.data.workerName || '', Validators.required],

    restrictionsWorker: [this.restrictionsWorker],
  });

  constructor(
    public dialogRef: MatDialogRef<WorkerDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      workerName: string;
      turns: Turn[];
      isCommon?: boolean;
      eliminate: (workerToEliminate: String) => void;
    },
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.workerForm.get('name')?.setValue(this.data.workerName);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveWorker(): void {
    if (this.workerForm.valid) {
      this.dialogRef.close(this.workerForm.value);
    }
  }

  onSelectionChange(turn: Turn) {
    const index = this.restrictionsWorker.findIndex(
      (t) => t.day === turn.day && t.startTime === turn.startTime
    );

    if (index === -1) {
      this.restrictionsWorker.push(turn);
    } else {
      this.restrictionsWorker.splice(index, 1);
    }
  }
}
