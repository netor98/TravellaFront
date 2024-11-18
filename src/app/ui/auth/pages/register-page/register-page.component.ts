import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../../services/auth.service";
import Swal from "sweetalert2";
import {Router} from "@angular/router";
import {RolesEnum} from "../../../../domain/models/roles.enum";

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.css',


})
export class RegisterPageComponent {
  public role: RolesEnum = RolesEnum.guest;
  public isLoading: boolean = false;
  public isPopupVisible: boolean = false;
  public passwordValidLength: boolean = false;
  public passwordHasNumber: boolean = false;
  public passwordHasUpperCase: boolean = false;
  public passwordHasLowerCase: boolean = false;
  public passwordHasSpecialChar: boolean = false;

  onPasswordInput(value: string): void {

    this.passwordValidLength = value.length >= 8;
    this.passwordHasNumber = /\d/.test(value);
    this.passwordHasUpperCase = /[A-Z]/.test(value);
    this.passwordHasLowerCase = /[a-z]/.test(value);
    this.passwordHasSpecialChar = /[!¡@#$%^&*(),.?":{}|<>]/.test(value);
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) {
  }


  public showPassword(input: HTMLElement): void {
    const inputType = input.getAttribute('type');
    if (inputType === 'password') {
      input.setAttribute('type', 'text');
    } else {
      input.setAttribute('type', 'password');
    }
  }

  public form = this.fb.group({
    name: ['asdasdasdasd', Validators.required],
    email: ['nestordillapadilla@gmail.com', [Validators.required, Validators.email]],
    password: ['A1b2c3d4@', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['A1b2c3d4@', [Validators.required, Validators.minLength(6)]]
  });


  register() {
    const {name, email, password, confirmPassword} = this.form.value;
    if (password !== confirmPassword) {
      return;
    }
    this.role = RolesEnum.user;
    this.authService.showLoadingSpinner('Creating account...');
    this.authService.register(name!, email!, password!, this.role)
      .subscribe({
        next: () => {
          this.isLoading = false;
          Swal.fire({
            html: `
        <div class="flex flex-col items-center p-6">
          <!-- Icon Section -->
          <div class="flex justify-center items-center mb-4">
            <div class="w-12 h-12 bg-black rounded-full flex items-center justify-center">
              <i class="pi pi-envelope text-white font-bold"></i>
            </div>
          </div>

          <!-- Title and Message -->
          <h2 class="text-lg font-semibold mb-2">Check Your Email</h2>
          <p class="text-sm text-gray-600 mb-4">We’ve sent you a link to confirm your email.</p>

          <!-- Button -->
          <button id="gotItButton" class="bg-black text-white w-full py-2 rounded-md font-semibold hover:bg-gray-800 mb-4">Got it</button>

        </div>
      `,
            showConfirmButton: false,
            customClass: {
              popup: 'rounded-lg shadow-lg',
            },
            didOpen: () => {
              const gotItButton = document.getElementById('gotItButton');
              if (gotItButton) {
                gotItButton.addEventListener('click', () => Swal.close());
                this.router.navigate(['/login']);
              }
            }
          });
        },
        error: (err) => {
          Swal.fire({
            title: 'Error',
            html: err.message,
            icon: 'error',
            confirmButtonText: 'Ok'
          });
          this.isLoading = false;
          this.form.get('password')?.reset();
          this.form.get('confirmPassword')?.reset();
        }
      });
  }
}
