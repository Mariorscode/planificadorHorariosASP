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
  restrictionsSpace = new FormControl();

  spaceForm = this.fb.group({
    name: ['', Validators.required],
    spaceCapacity: ['', Validators.required],
    restrictionsSpace: this.restrictionsSpace,
  });

  constructor(
    public dialogRef: MatDialogRef<SpaceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Turn[],
    private fb: FormBuilder
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveSpace(): void {
    if (this.spaceForm.valid) {
      this.dialogRef.close(this.spaceForm.value);
    }
    console.log('DATA dentro dialogo', this.data);
  }
}
