import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
} from '@angular/forms';

import { Tag } from 'src/app/stteper-form/stteper-form.component';

@Component({
  selector: 'app-tagsDialog',
  templateUrl: './tagsDialog.component.html',
  styleUrls: ['./tagsDialog.component.css'],
})
export class TagsDialogComponent {
  tagsToAdd: Tag[] = [];
  tagForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<TagsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tags: Tag[] },
    private fb: FormBuilder
  ) {
    this.tagForm = this.fb.group({
      name: ['', Validators.required],
    });

    this.tagForm.controls['name'].valueChanges.subscribe(() => {
      this.validateTag();
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  validateTag() {
    const nameValue = this.tagForm.controls['name'].value.trim().toLowerCase();
    const tagExists = this.data.tags.some(
      (tag) => tag.name.toLowerCase() === nameValue
    );

    if (tagExists) {
      this.tagForm.controls['name'].setErrors({ tagExists: true });
    } else {
      this.tagForm.controls['name'].setErrors(null);
    }
  }

  saveTags(): void {
    if (this.tagForm.valid) {
      const newTag = {
        name: this.tagForm.controls['name'].value.trim().toLowerCase(),
      };
      this.dialogRef.close(newTag);
    }
  }
}
