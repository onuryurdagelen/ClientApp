import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterVM } from '../shared/models/register';
import { BaseHttpService } from '../shared/services/base-http-service';
import { map, catchError } from 'rxjs/operators';
import { Observable, ReplaySubject, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginVM } from '../shared/models/login';
import { User } from '../shared/models/user';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AccountService extends BaseHttpService {

  private userSource = new ReplaySubject<User | null>(1);
  user$ = this.userSource.asObservable();

  constructor(http: HttpClient,protected router:Router) {
    super(http, "/account"); // Provide the base URL
  }

  register(model: RegisterVM): Observable<void> {
    return this.post<RegisterVM, null>(model, "/register");
  }
  login(model: LoginVM) {
    return this.post<LoginVM, User>(model, "/login").pipe(
      map((user: any) => {
        if (user) {
          this.setUser(user)
        }
      })
    );
  }
  private setUser(user: User) {
    localStorage.setItem(environment.userKey, JSON.stringify(user));
    this.userSource.next(user);
  }
  logout(){
    localStorage.removeItem(environment.userKey);
    this.userSource.next(null);
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
          this.setUser(user);
      })
    )

  }
  getJwtToken(): string | null {
    const key = localStorage.getItem(environment.userKey);
    if (key) {
      const user: User = JSON.parse(key);
      return user.jwt;
    } else {
      return null;
    }
  }

}
