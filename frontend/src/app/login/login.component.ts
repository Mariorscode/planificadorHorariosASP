import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { schedulerASP } from '../schedulerASP.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  password: string = '';
  username: string = '';

  loginForm = this.fb.group({
    password: ['', Validators.required],
    username: ['', Validators.required],
  });

  login() {
    this.getToken();
  }

  getToken() {
    const data = {
      password: this.loginForm.get('password')?.value,
      username: this.loginForm.get('username')?.value,
    };

    this.schedulerASP.createToken(data).subscribe(
      (data) => {
        console.log(data);
        console.log(data.access);
        // this.token = data.access;
        localStorage.setItem('token', data.access);
        this.router.navigate(['/homepage']);
      },
      (error) => {
        console.log(error);
        let snackBarRef = this.snackBar.open('Usuario introducido no válido');
      }
    );
  }

  constructor(
    private fb: FormBuilder,
    private schedulerASP: schedulerASP,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}
}
