import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterVM } from '../shared/models/account/register';
import { BaseHttpService } from '../shared/services/base-http-service';
import { map, catchError } from 'rxjs/operators';
import { Observable, ReplaySubject, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginVM } from '../shared/models/account/login';
import { User } from '../shared/models/account/user';
import { Router } from '@angular/router';
import { ConfirmEmail } from '../shared/models/account/confirmEmail';
import { ResetPassword } from '../shared/models/account/resetPassword';
import { RefreshTokenDto, UserDto } from '../shared/dtos/userDto';
@Injectable({
  providedIn: 'root'
})
export class AccountService extends BaseHttpService {

  private userSource = new ReplaySubject<UserDto | null>(1);
  private refreshTokenSource = new ReplaySubject<RefreshTokenDto | null>(1);
  user$ = this.userSource.asObservable();
  refreshToken$ = this.refreshTokenSource.asObservable();

  constructor(http: HttpClient, protected router: Router) {
    super(http, "/account"); // Provide the base URL
  }

  register(model: RegisterVM): Observable<void> {
    return this.post<RegisterVM, null>(model, "/register");
  }
  login(model: LoginVM) {
    return this.post<LoginVM, User>(model, "/login").pipe(
      map((user: any) => {
        if (user) {
          this.setUser({ firstName: user.firstName, lastName: user.lastName, jwt: user.token.accessToken })
          this.setRefreshToken({ token: user.token.refreshToken.token, userId: user.token.refreshToken.userId });
        }
      })
    );
  }
  confirmEmail(confirmEmail: ConfirmEmail) {
    return this.http.put<ConfirmEmail>(`${environment.apiUrl}/account/confirm-email`, confirmEmail);
  }
  reSendEmailConfirmationLink(emailAddress: string) {
    return this.http.post<any>(`${environment.apiUrl}/account/resend-email-confirmation-link/${emailAddress}`, {});
  }
  refreshToken(token: string, userId: string) {
    return this.http.post<any>(`${environment.apiUrl}/account/refresh-token`, { token: token, userId: userId });
  }
  forgotUsernameOrPassword(emailAddress: string) {
    return this.http.post<any>(`${environment.apiUrl}/account/forgot-username-or-password/${emailAddress}`, {});
  }
  resetPassword(resetPassword: ResetPassword) {
    return this.http.put<ResetPassword>(`${environment.apiUrl}/account/reset-password`, resetPassword);
  }
  setUser(user: UserDto) {
    localStorage.setItem(environment.userKey, JSON.stringify(user));
    this.userSource.next(user);
  }
  setRefreshToken(refreshToken: RefreshTokenDto) {
    localStorage.setItem(environment.refreshTokenKey, JSON.stringify(refreshToken));
    this.refreshTokenSource.next(refreshToken);
  }
  getRefreshToken(): ReplaySubject<RefreshTokenDto | null> {
    return this.refreshTokenSource;
  }
  getUser(): ReplaySubject<UserDto | null> {
    return this.userSource;
  }
  logout() {
    localStorage.removeItem(environment.userKey);
    localStorage.removeItem(environment.refreshTokenKey);
    this.userSource.next(null);
    this.refreshTokenSource.next(null);
    this.router.navigateByUrl('/');
  }
  refreshUser(jwt: string | null) {
    if (jwt == null) {
      this.userSource.next(null);
      return of(undefined);
    }
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${jwt}`);

    return this.http.get<User>(`${environment.apiUrl}/account/refresh-user-token`, { headers }).pipe(
      map((user: User) => {
        if (user)
          this.setUser({ firstName: user.firstName, lastName: user.lastName, jwt: user.token.accessToken })
      })
    )

  }
  getJwtToken(): string | null {
    const key = localStorage.getItem(environment.userKey);
    if (key) {
      const user: UserDto = JSON.parse(key);
      return user.jwt;
    } else {
      return null;
    }
  }

}
