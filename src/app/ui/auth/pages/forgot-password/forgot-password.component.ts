import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../../services/auth.service";
import {Router} from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
  }

  public form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  public forgotPassword(): void {
    const {email} = this.form.value;

    this.authService.showLoadingSpinner('Checking email...');
    this.authService.recoverPassword(email!).subscribe({
      next: () => {
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
          <p class="text-sm text-gray-600 mb-4">We’ve sent you a link to reset your password.</p>

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
        const errorMessage = err;
        console.log(errorMessage)
        Swal.fire({
          title: 'Error',
          html: err.message,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
        /*
                if (errorMessage == "Could not find user with email") {
                  Swal.fire('User Not Found', 'No account found with this email. Please sign up.', 'error');
                } else if (errorMessage == "Your email is not confirmed. We have resent the confirmation link to your email. Please confirm your email to proceed with resetting your password.") {
                  Swal.fire('Error', 'Please check your email, and confirm your account', 'error');
                }
        */
      }
    });
  }
}
