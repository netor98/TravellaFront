import {computed, Injectable, signal} from "@angular/core";
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {User} from "../domain/models/user.model";
import {catchError, map, Observable, tap, throwError} from "rxjs";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import {LoginResponse} from "../domain/models/login-response.interface";
import {AuthStatus} from "../domain/models/auth-status.enum";
import {RefreshTokenResponse} from "../domain/models/RefreshTokenResponse";


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private readonly baseUrl: string = environment.BASE_URL;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadAuthStatus();
  }

  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  public currentUser = computed(() => this._currentUser);
  public authStatus = computed(() => this._authStatus);


  public login(email: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/login`;
    const body = {email, password};


    return this.http.post<LoginResponse>(url, body, {withCredentials: true})
      .pipe(
        tap(({jwt, name, email, role, id}) => {
          this._currentUser.set({id, name, email, role});
          this._authStatus.set(AuthStatus.authenticated);
          const user = this.currentUser()();
          localStorage.setItem('jwt', jwt);
          localStorage.setItem('currentUser', JSON.stringify(user));
        }),
        map(() => true),

        // Todo: Errors handling
        catchError(err => {
          return throwError(() => err);
        })
      );
  }

  public haveAccess() {
    var loggin = localStorage.getItem('jwt');
    var _extracted = loggin!.split('.')[1];
    var _atob = atob(_extracted);
    var _finalExtracted = JSON.parse(_atob);
    console.log(_finalExtracted);
  }

  public logout(): void {
    localStorage.removeItem('jwt');
    localStorage.removeItem('currentUser');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
    this.router.navigate(['/']);
  }

  public refreshJwt(): Observable<string> {
    const url = `${this.baseUrl}/auth/refresh-token`;
    const UserId = this.currentUser()()?.id;

    return this.http.post<RefreshTokenResponse>(url, {UserId}, {withCredentials: true})
      .pipe(
        tap(({jwt, name, email, role, id}) => {
          this._currentUser.set({id, name, email, role});
          this._authStatus.set(AuthStatus.authenticated);
        }),
        map(response => response.jwt),
        catchError(error => {
          console.error('Refresh token failed', error);
          return throwError(() => 'Token refresh failed');
        })
      );
  }

  private loadAuthStatus(): void {
    const token = localStorage.getItem('jwt');
    const savedUser = localStorage.getItem('currentUser');

    if (token && savedUser) {
      this._authStatus.set(AuthStatus.authenticated);
      this._currentUser.set(JSON.parse(savedUser!));
    } else {
      console.log(savedUser)
      this._authStatus.set(AuthStatus.notAuthenticated);
    }
  }


  public recoverPassword(email: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/ForgotPassword?email=${email}`;

    return this.http.post(url, null)
      .pipe(
        map(() => {
          return true;
        }),
        catchError(err => {
          console.log(err.error)
          return throwError(() => new Error(err.error));
        })
      );
  }


  public resetPassword(
    email: string,
    token: string,
    password: string,
    confirmPassword: string
  ): Observable<boolean> {
    const url = `${this.baseUrl}/auth/ResetPassword`;
    const body = {email, token, password, confirmPassword};

    return this.http.post(url, body)
      .pipe(
        map(() => {
          return true
        }),
        catchError(err => {
          if (err.error) {
            const errors = err.error;
            const errorMessages: string[] = [];

            for (const key in errors) {
              if (errors.hasOwnProperty(key)) {
                const messages = errors[key];
                if (Array.isArray(messages)) {
                  messages.forEach((message: string) => {
                    errorMessages.push(message);
                  });
                }
              }
            }
            const combinedErrorMessages = errorMessages.join('<br>');
            return throwError(() => new Error(combinedErrorMessages))
          }
          return throwError(() => "An error occurred");
        })
      );
  }

  public register(name: string, email: string, password: string, role: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/register`;
    const body = {name, email, password, role};

    return this.http.post(url, body)
      .pipe(
        map(() => {
          return true;
        }),

        catchError(err => {
          console.log(err)
          if (err.error?.message) {
            err.error.errors.forEach((error: any) => {
              console.error(error);
            });
            const errorMessages = err.error.errors
              .map((error: any) => error)
              .join('<br>');
            return throwError(() => new Error(errorMessages));
          }
          return throwError(() => 'bad credentials');
        })
      );
  }

  public showLoadingSpinner(title: string = 'Loading'): void {
    Swal.fire({
      title,
      html: `
        <div class="flex justify-center items-center overflow-y-hidden">
          <div class="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
        </div>
      `,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      backdrop: true,
      customClass: {
        popup: 'bg-white rounded-lg shadow-lg',
        title: 'text-lg font-semibold text-gray-700 mb-4',
      }
    });
  }

  public hideLoadingSpinner(): void {
    Swal.close();
  }
}
