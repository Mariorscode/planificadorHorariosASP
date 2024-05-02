import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { Worker } from 'src/app/stteper-form/stteper-form.component';
import { Turn } from 'src/app/stteper-form/stteper-form.component';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-workerDialog',
  templateUrl: './workerDialog.component.html',
  styleUrls: ['./workerDialog.component.css'],
})
export class WorkerDialogComponent {
  restrictionsWorker: Turn[] = [];

  workerForm = this.fb.group({
    name: [this.data.workerName || '', Validators.required],
    restrictionsWorker: [this.restrictionsWorker, Validators.required],
  });

  constructor(
    public dialogRef: MatDialogRef<WorkerDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      workerName: string;
      turns: Turn[];
      eliminate: (workerToEliminate: String) => void;
    },
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Set the form value based on data.space
    this.workerForm.get('name')?.setValue(this.data.workerName);
    console.log('NOMBREEE', this.data.workerName);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveSpace(): void {
    // If the name of the space is the same, do not eliminate it
    if (this.data.workerName === this.workerForm.get('name')?.value) {
    } else {
      // If the name of the space is different, eliminate the space
      this.data.eliminate(this.data.workerName);
    }
    this.dialogRef.close(this.workerForm.value);

    // console.log('DATA dentro dialogo', this.data);
  }

  onSelectionChange(turn: Turn) {
    // Verify if the turn is already selected
    const index = this.restrictionsWorker.findIndex(
      (t) => t.day === turn.day && t.startTime === turn.startTime
    );

    if (index === -1) {
      // if it is not selected, add it to the list
      this.restrictionsWorker.push(turn);
    } else {
      // if it is selected, remove it from the list
      this.restrictionsWorker.splice(index, 1);
    }

    console.log('Selected Space turns:', this.restrictionsWorker);
  }
}
