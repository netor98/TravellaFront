import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../../services/auth.service";
import Swal from "sweetalert2";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styles: ``
})
export class LoginPageComponent {

  public isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
  }

  public form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });


  public showPassword(input: HTMLElement): void {
    const inputType = input.getAttribute('type');
    if (inputType === 'password') {
      input.setAttribute('type', 'text');
    } else {
      input.setAttribute('type', 'password');
    }
  }


  login(): void {
    const {email, password} = this.form.value;
    this.isLoading = true;
    this.authService.showLoadingSpinner('Logging in...');
    this.authService.login(email!, password!)
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
          this.authService.hideLoadingSpinner();
        },
        error: (err) => {
          this.form.get('password')?.reset();
          const errorMessage = err.error;
          if (errorMessage === "Password is incorrect") {
            Swal.fire('Login Error', 'The password you entered is incorrect. Please try again.', 'error');
          } else if (errorMessage === "Email not confirmed") {
            Swal.fire('Email Not Confirmed', 'Please confirm your email address to log in.', 'warning');
          } else if (errorMessage === "User not found") {
            Swal.fire('User Not Found', 'No account found with this email. Please sign up.', 'error');
          } else {
            Swal.fire('Login Error', 'An unexpected error occurred. Please try again later.', 'error');
          }
        }
      });
  }
}
