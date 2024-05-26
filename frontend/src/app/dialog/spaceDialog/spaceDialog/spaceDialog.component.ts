import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { Space } from 'src/app/stteper-form/stteper-form.component';
import { Turn } from 'src/app/stteper-form/stteper-form.component';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-spaceDialog',
  templateUrl: './spaceDialog.component.html',
  styleUrls: ['./spaceDialog.component.css'],
})
export class SpaceDialogComponent {
  restrictionsSpace: Turn[] = [];

  spaceForm = this.fb.group({
    name: [this.data.spaceName || '', Validators.required],
    spaceCapacity: [0, Validators.required],
    restrictionsSpace: [this.restrictionsSpace, Validators.required],
  });

  constructor(
    public dialogRef: MatDialogRef<SpaceDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      spaceName: string;
      turns: Turn[];
      eliminate: (spaceToEliminate: String) => void;
    },
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Set the form value based on data.space
    this.spaceForm.get('name')?.setValue(this.data.spaceName);
    console.log('NOMBREEE', this.data.spaceName);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveSpace(): void {
    // If the name of the space is the same, do not eliminate it
    // if (this.data.spaceName == this.spaceForm.get('name')?.value) {
    // }
    this.dialogRef.close(this.spaceForm.value);

    // console.log('DATA dentro dialogo', this.data);
  }

  onSelectionChange(turn: Turn) {
    // Verify if the turn is already selected
    const index = this.restrictionsSpace.findIndex(
      (t) => t.day === turn.day && t.startTime === turn.startTime
    );

    if (index === -1) {
      // if it is not selected, add it to the list
      this.restrictionsSpace.push(turn);
    } else {
      // if it is selected, remove it from the list
      this.restrictionsSpace.splice(index, 1);
    }

    console.log('Selected Space turns:', this.restrictionsSpace);
  }
}
