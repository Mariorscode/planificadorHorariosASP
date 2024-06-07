import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { schedulerASP } from '../schedulerASP.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

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
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    username: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private schedulerASP: schedulerASP,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  getToken() {
    const data = {
      password: this.loginForm.get('password')?.value,
      username: this.loginForm.get('username')?.value,
    };

    this.schedulerASP.createToken(data).subscribe(
      (data) => {
        console.log(data);
        console.log(data.access);
        localStorage.setItem('token', data.access);
        this.router.navigate(['/login']); // Redirige al login después de obtener el token
      },
      (error) => {
        console.log(error);
        this.snackBar.open('Error al obtener el token', 'Cerrar', {
          duration: 3000,
          panelClass: ['custom-snackbar'],
        });
      }
    );
  }

  register() {
    if (this.loginForm.invalid) {
      this.snackBar.open(
        'Por favor, complete todos los campos correctamente',
        'Cerrar',
        {
          duration: 3000,
          panelClass: ['custom-snackbar'],
        }
      );
      return;
    }

    const data = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
      username: this.loginForm.get('username')?.value,
    };

    console.log(data);
    this.schedulerASP.createUser(data).subscribe(
      (data) => {
        console.log(data.id);
        localStorage.setItem('userId', data.id);
        this.getToken(); // Obtén el token después del registro exitoso
      },
      (error) => {
        console.log(error);
        this.snackBar.open(
          'Error al registrar el usuario, pruebe con otro',
          'Cerrar',
          {
            duration: 3000,
            panelClass: ['custom-snackbar'],
          }
        );
      }
    );
  }
}
