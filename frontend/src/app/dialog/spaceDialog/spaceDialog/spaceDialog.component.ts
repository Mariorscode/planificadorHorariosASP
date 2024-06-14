import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';

import { Space } from 'src/app/stteper-form/stteper-form.component';
import { Turn } from 'src/app/stteper-form/stteper-form.component';

@Component({
  selector: 'app-spaceDialog',
  templateUrl: './spaceDialog.component.html',
  styleUrls: ['./spaceDialog.component.css'],
})
export class SpaceDialogComponent {
  restrictionsSpace: Turn[] = [];
  isCommon = this.data.isCommon || false;

  spaceForm = this.fb.group({
    name: [this.data.spaceName || '', Validators.required],
    spaceCapacity: [this.data.spaceCapacity || 0, Validators.required],

    restrictionsSpace: [this.restrictionsSpace],
  });

  constructor(
    public dialogRef: MatDialogRef<SpaceDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      spaceName: string;
      spaceCapacity: number;
      turns: Turn[];
      isCommon?: boolean;
      eliminate: (spaceToEliminate: String) => void;
    },
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.spaceForm.get('name')?.setValue(this.data.spaceName);
    this.spaceForm.get('spaceCapacity')?.setValue(this.data.spaceCapacity);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveSpace(): void {
    if (this.spaceForm.valid) {
      this.dialogRef.close(this.spaceForm.value);
    }
  }

  onSelectionChange(turn: Turn) {
    const index = this.restrictionsSpace.findIndex(
      (t) => t.day === turn.day && t.startTime === turn.startTime
    );

    if (index === -1) {
      this.restrictionsSpace.push(turn);
    } else {
      this.restrictionsSpace.splice(index, 1);
    }
  }
}
