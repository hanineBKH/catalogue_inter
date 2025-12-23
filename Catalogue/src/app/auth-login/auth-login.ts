import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../service/auth-service';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf,RouterModule], // <-- add NgIf here
  templateUrl: './auth-login.html',
  styleUrls: ['./auth-login.css']
})
export class AuthLogin {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
  email: [
    '',
    [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@teamwillgroup\.com$/)
    ]
  ],
  password: ['', Validators.required],
  remember: [false]
});
  }

onSubmit() {
  if (this.loginForm.invalid) {
    Swal.fire({
      icon: 'warning',
      title: 'Hold on',
      text: 'Fill in all fields correctly.',
      confirmButtonColor: '#3085d6'
    });
    return;
  }

  const { email, password, remember } = this.loginForm.value;

  this.authService.login(email, password).subscribe({
    next: (res: any) => {
      this.authService.saveToken(res.token);
      if (remember) this.authService.saveToken(res.token);

      Swal.fire({
        icon: 'success',
        title: 'Welcome ',
        text: 'Login avec success.',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        this.router.navigate(['']);
      });
    },

    error: (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Access refus',
        text: err.error?.message || 'email ou mot de passe invalid',
        confirmButtonColor: '#d33'
      });
    }
  });
}

}
