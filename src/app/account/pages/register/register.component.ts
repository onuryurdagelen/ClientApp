import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { bindCallback, take } from 'rxjs';
import { User } from 'src/app/shared/models/account/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

registerForm:FormGroup = new FormGroup({});
submitted:boolean = false;
errorMessages:string[] =[];
alertVisible:boolean = false;
constructor(
  private accountService:AccountService,
  private sweetAlertService:SweetAlertService,
  private formBuilder:FormBuilder,
  private router:Router
  ){
    this.accountService.user$.pipe(take(1)).subscribe({
      next:(user:User | null) => {
        if(user){
          this.router.navigateByUrl('/');
        }
      }
    })
  }

  ngOnInit(): void {
    this.initializeForm();
  }

initializeForm(){
  this.registerForm = this.formBuilder.group({
    firstName:['',[Validators.required,Validators.maxLength(15),Validators.minLength(3)]],
    lastName:['',[Validators.required,Validators.maxLength(15),Validators.minLength(3)]],
    emailAddress:['',[Validators.required,Validators.email,Validators.pattern("^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$")]],
    password:['',[Validators.required,Validators.minLength(6),Validators.maxLength(15)]]
  })
}
register(){
  this.submitted = true;
  this.errorMessages = [];
  
  if(this.registerForm.valid)
  {
    this.accountService.register(this.registerForm.value).subscribe({
      next:((response:any)=>{
        this.sweetAlertService.infoBox({
          title:response.value.title,
          html:response.value.message,
          icon:'info'
        })
      }),
      error:((error:any)=>{
        if(error.error.errors){
          this.errorMessages = error.error.errors;
        }
        else {
          this.errorMessages.push(error.error);
        }
        console.log(error)}),
      complete:(()=> console.log("register process completed!"))
    });
    
  }
}
}
