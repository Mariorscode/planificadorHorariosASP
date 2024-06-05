import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { schedulerASP } from '../schedulerASP.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  username: string = '';

  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
    username: ['', Validators.required],
  });

  login() {
    const data = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
      username: this.loginForm,
    };
    this.schedulerASP.createUser(data).subscribe(
      (data) => {
        console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  constructor(private fb: FormBuilder, private schedulerASP: schedulerASP) {}
}
