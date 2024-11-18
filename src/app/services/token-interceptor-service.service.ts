import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpRequest} from "@angular/common/http";
import {
  BehaviorSubject,
  catchError, filter,
  Observable,
  switchMap, take,
  tap,
  throwError
} from "rxjs";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorServiceService {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private auth: AuthService, private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwt = localStorage.getItem('jwt');
    const clonedRequest = jwt
      ? req.clone({headers: req.headers.set('Authorization', 'Bearer ' + jwt)})
      : req;

    return next.handle(clonedRequest).pipe(
      catchError((error) => {
        if (error.status === 401) {
          if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.handleRefreshToken().pipe(
              switchMap((newJwt: string) => {
                this.isRefreshing = false;
                this.refreshTokenSubject.next(newJwt);
                const retryRequest = req.clone({
                  headers: req.headers.set('Authorization', 'Bearer ' + newJwt)
                });
                return next.handle(retryRequest);
              }),
              catchError(refreshError => {
                this.isRefreshing = false;
                this.auth.logout();
                this.router.navigateByUrl('auth/login');
                return throwError(refreshError);
              })
            )
          }
          // Attempt to refresh the token and retry the request
          return this.handleRefreshToken().pipe(
            filter(jwt => jwt !== null),
            take(1),
            switchMap((newJwt: string) => {
              // Retry the request with the new token
              const retryRequest = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + newJwt)
              });
              return next.handle(retryRequest);
            }),
          );
        }
        return throwError(error);
      })
    );
  }

  public handleRefreshToken(): Observable<string> {
    return this.auth.refreshJwt().pipe(
      tap((jwt) => {
        localStorage.setItem('jwt', jwt);
      }),
      catchError((err) => {
        console.log(err);
        return throwError(err);
      })
    );
  }
}
