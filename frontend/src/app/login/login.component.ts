import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
  loginError: boolean = false;

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
        const token = data.access;
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 1);

        localStorage.setItem('token', token);
        localStorage.setItem('tokenExpiration', expirationDate.toString());

        const username = this.loginForm.get('username')?.value;
        if (username) {
          this.schedulerASP.getUserByUserName(username).subscribe(
            (data) => {
              localStorage.setItem('userId', data.id);
              this.router.navigate(['/homepage']);
            },
            (error) => {
              this.loginError = true;
            }
          );
        }
      },
      (error) => {
        this.loginError = true;
        this.snackBar.open(
          'Hay un error con las credenciales introducidas, revisa tu usuario y contraseña. Si no tienes cuenta, regístrate.',
          'Quitar',
          {
            duration: 5000,
          }
        );
      }
    );
  }
  redirectToRegister() {
    this.router.navigate(['/register']);
  }

  constructor(
    private fb: FormBuilder,
    private schedulerASP: schedulerASP,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}
}
