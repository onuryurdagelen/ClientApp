import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, from, switchMap, take, throwError } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { User } from '../models/account/user';
import { TokenService } from '../services/token.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private accountService: AccountService,
    private tokenService:TokenService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const user = this.tokenService.getUser();
    if(user)
      request = this.addToken(request,user.jwt);

    return next.handle(request).pipe(
      catchError((error:HttpErrorResponse) => {
        if (error.status === 401) {
        const refreshToken =  this.tokenService.getRefreshToken();
        if(refreshToken){
          return from(this.accountService.refreshToken(refreshToken.token,refreshToken.userId)).pipe(
            switchMap((user:User) => {
              // Update the request with the new access token
              request = this.addToken(request, user.token.accessToken);
              this.accountService.setUser({firstName:user.firstName,lastName:user.lastName,jwt:user.token.accessToken});
              this.accountService.setRefreshToken({token:user.token.refreshToken.token,userId:user.token.refreshToken.userId});
              // Retry the request with the new token
              return next.handle(request);
            }),
            catchError(()=> {
              //force logout çalıştır
              //hata mesajı gönder.
              return throwError(()=> new Error('Refresh token failed,logging out...'));
            })
          );
        }
        }

        throw error;
      })
    )
  }
  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
