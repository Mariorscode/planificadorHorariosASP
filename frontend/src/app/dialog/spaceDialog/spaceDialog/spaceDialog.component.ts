import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { Space } from 'src/app/stteper-form/stteper-form.component';
import { Turn } from 'src/app/stteper-form/stteper-form.component';
import { Dialog } from '@angular/cdk/dialog';
import { S } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-spaceDialog',
  templateUrl: './spaceDialog.component.html',
  styleUrls: ['./spaceDialog.component.css'],
})
export class SpaceDialogComponent {
  restrictionsSpace: Turn[] = [];
  isCommonSpace = this.data.isCommonSpace || false;

  spaceForm = this.fb.group({
    name: [this.data.space.name || '', Validators.required],
    spaceCapacity: [this.data.space.spaceCapacity, Validators.required],
    restrictionsSpace: [this.restrictionsSpace, Validators.required],
  });

  constructor(
    public dialogRef: MatDialogRef<SpaceDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      space: Space;
      turns: Turn[];
      isCommonSpace?: boolean;
      eliminate: (spaceToEliminate: String) => void;
    },
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Set the form value based on data.space
    this.spaceForm.get('name')?.setValue(this.data.space.name);

    this.spaceForm
      .get('spaceCapacity')
      ?.setValue(this.data.space.spaceCapacity);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveSpace(): void {
    this.dialogRef.close(this.spaceForm.value);
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
  }
}
