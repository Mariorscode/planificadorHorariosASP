import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { Tag } from 'src/app/stteper-form/stteper-form.component';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-tagsDialog',
  templateUrl: './tagsDialog.component.html',
  styleUrls: ['./tagsDialog.component.css'],
})
export class TagsDialogComponent {
  tagsToAdd: Tag[] = [];
  name: string = '';

  tagForm = this.fb.group({
    // name: [this.data.spaceName || '', Validators.required],
    // spaceCapacity: ['', Validators.required],
    // restrictionsSpace: [this.restrictionsSpace, Validators.required],
    tagsToAdd: [this.tagsToAdd, Validators.required],
  });
  constructor(
    public dialogRef: MatDialogRef<TagsDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {},
    private fb: FormBuilder
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  addTag(name: string) {
    // Verify if the tag already exists if not add it
    const auxTag = { name: name };
    const index = this.tagsToAdd.findIndex((t) => t.name === name);
    if (index === -1) {
      this.tagsToAdd.push(auxTag);
    }
  }

  saveTags(): void {
    this.dialogRef.close(this.tagsToAdd);
  }
}
