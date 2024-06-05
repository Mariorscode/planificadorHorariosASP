import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { schedulerASP } from '../schedulerASP.service';
import { C } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  username: string = '';

  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
    username: ['', Validators.required],
  });
  constructor(private fb: FormBuilder, private schedulerASP: schedulerASP) {}

  getToken() {
    const data = {
      password: this.loginForm.get('password')?.value,
      username: this.loginForm.get('username')?.value,
    };
    this.schedulerASP.createToken(data).subscribe(
      (data) => {
        console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  register() {
    const data = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
      username: this.loginForm.get('username')?.value,
    };

    console.log(data);
    this.schedulerASP.createUser(data).subscribe(
      (data) => {
        console.log(data);
        this.getToken();
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
