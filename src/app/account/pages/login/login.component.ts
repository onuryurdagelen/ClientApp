import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../account.service';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { User } from 'src/app/shared/models/account/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm:FormGroup = new FormGroup({});
  returnUrl:string | null = null;
  submitted:boolean = false;
  errorMessages:string[] =[];
  alertVisible:boolean = false;
  constructor(
    private accountService:AccountService,
    private sweetAlertService:SweetAlertService,
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private formBuilder:FormBuilder){
      this.accountService.user$.pipe(take(1)).subscribe({
        next:(user:User | null) => {
          if(user){
            this.router.navigateByUrl('/');
          }else {
            this.activatedRoute.queryParamMap.subscribe({
              next:(params:any) => {
                if(params){
                  this.returnUrl = params.get('returnUrl');
                }
              }
            })
          }
        }
      })
    }
  
    ngOnInit(): void {
      this.initializeForm();
    }
  
  initializeForm(){
    this.loginForm = this.formBuilder.group({
      userName:['',[Validators.required]],
      password:['',[Validators.required,Validators.minLength(6),Validators.maxLength(15)]]
    })
  }
  login(){
    this.submitted = true;
    this.errorMessages = [];

    if(this.loginForm.valid){

    }
    this.accountService.login(this.loginForm.value).subscribe({
      next:((response:any)=>{
        if(this.returnUrl){
          this.router.navigateByUrl(this.returnUrl);
        }
        else {
          this.router.navigateByUrl('/');
        }

      }),
      error:((error:any)=>{
        if(error.error.errors){
          this.errorMessages = error.error.errors;
        }
        else {
          this.errorMessages.push(error.error.Message);
        }
        console.log(this.errorMessages)
      
      }),
      complete:(()=> console.log("register process completed!"))
    })
   
  }
  reSendEmailConfirmationLink(){
    this.router.navigateByUrl('/account/send-email/resend-email-confirmation-link')
  }
  resetUsernamOrPassword(){
    
  }
}
