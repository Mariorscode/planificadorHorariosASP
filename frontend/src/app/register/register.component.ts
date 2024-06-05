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
        console.log(data.access);
        // this.token = data.access;
        localStorage.setItem('token', data.access);
        // this.postPrueba(); // Realiza la solicitud después de obtener el token
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // postPrueba() {
  //   const data = {
  //     name: 'bbb',
  //     turnsDuration: 1,
  //     turnsPerDay: 1,
  //     start_time: 'bbb',
  //     user_id: 1,
  //   };
  //   console.log('local:', localStorage.getItem('token'));
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     this.schedulerASP.postDataWithToken(token, data).subscribe(
  //       (data) => {
  //         console.log(data);
  //       },
  //       (error) => {
  //         console.log(error);
  //       }
  //     );
  //   } else {
  //     console.log('Token not found');
  //   }
  // }

  register() {
    const data = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
      username: this.loginForm.get('username')?.value,
    };

    console.log(data);
    this.schedulerASP.createUser(data).subscribe(
      (data) => {
        // console.log(data);
        localStorage.setItem('userId', data.id);
        this.getToken(); // Obtén el token después del registro exitoso
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
