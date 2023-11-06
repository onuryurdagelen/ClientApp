import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { User } from 'src/app/shared/models/account/user';
import { ConfirmEmail } from 'src/app/shared/models/account/confirmEmail';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit {
  success:boolean = true;
  confirmed:boolean = false;
  message:string;
  constructor(
    private accountService:AccountService,
    private notificationService:NotificationService,
    private router:Router,
    private activatedRoute:ActivatedRoute // url'deki token ve email parametrelerindeki değerleri almak için inject ettik.
    ){}
  
  ngOnInit(): void {
    debugger;
    this.accountService.user$.pipe(take(1)).subscribe({
      next:(user:User | null)=>{
        if(user) //kullanıcı var ise ana sayfaya yönlendir
        this.router.navigateByUrl('/');
        //Kullanıcı yok ise parametreleri al
        else {
          this.activatedRoute.queryParamMap.subscribe({
            next:(params:any)=>{
              console.log(params.get('token'));
              console.log(params.get('emailAddress'));
              const confirmEmail:ConfirmEmail = {
                token: params.get('token'),
                emailAddress:params.get('emailAddress')
              }
              this.accountService.confirmEmail(confirmEmail).subscribe({
                next:((response:any) => {
                }),
                error:((error:any)=>{
                  this.success = false;
                  this.confirmed = error.error.confirmed;
                  this.message = error.error.message;
                  this.notificationService.error('Hata',this.message);
                })
              })
            }
          })
        }
      }
    })
  }
  reSendEmailConfirmationLink(){
    this.router.navigateByUrl('/account/send-email/resend-email-confirmation-link')
  }
}
