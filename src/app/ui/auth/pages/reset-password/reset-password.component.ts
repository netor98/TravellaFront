import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../../services/auth.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  public token: string = '';
  public email: string = '';
  public isPopupVisible: boolean = false;
  public passwordValidLength: boolean = false;
  public passwordHasNumber: boolean = false;
  public passwordHasUpperCase: boolean = false;
  public passwordHasLowerCase: boolean = false;
  public passwordHasSpecialChar: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
  }

  public form = this.formBuilder.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
  });


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];
    });
  }


  public onPasswordInput(value: string): void {

    this.passwordValidLength = value.length >= 8;
    this.passwordHasNumber = /\d/.test(value);
    this.passwordHasUpperCase = /[A-Z]/.test(value);
    this.passwordHasLowerCase = /[a-z]/.test(value);
    this.passwordHasSpecialChar = /[!¡@#$%^&*(),.?":{}|<>]/.test(value);
  }

  public resetPassword(): void {
    const {password, confirmPassword} = this.form.value;
    this.authService.showLoadingSpinner('Resetting password...');
    this.authService.resetPassword(this.email, this.token, password!, confirmPassword!)
      .subscribe({
        next: () => {
          Swal.fire('Success', 'Password reset successfully. Please login with your new password.', 'success');
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          console.log(err);
          Swal.fire({
            title: 'Error',
            html: err.message,
            icon: 'error',
            confirmButtonText: 'Ok'
          });
          this.form.get('password')?.reset();
          this.form.get('confirmPassword')?.reset();
        }
      });
  }
}
