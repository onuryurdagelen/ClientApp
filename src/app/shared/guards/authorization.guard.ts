import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { User } from '../models/account/user';
import { Injectable } from '@angular/core';
import { UserDto } from '../dtos/userDto';

@Injectable({
  providedIn:'root'
})
export class AuthorizationGuard{
  constructor(
    private accountService:AccountService,
    private router:Router
    ){}

    canActivate(
      route:ActivatedRouteSnapshot,
      state:RouterStateSnapshot,
    ):Observable<boolean> {
      return this.accountService.user$.pipe(
        map((user:UserDto | null)=> {
          if(user){
            return true;
          }else {
            //kullancıya bilgi mesajı gönder.
            this.router.navigate(['account/login'],{queryParams: {returnUrl:state.url}});
            return false;
          }
        })
      );
    }

}
