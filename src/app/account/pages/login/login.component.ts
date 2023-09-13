import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../account.service';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm:FormGroup = new FormGroup({});
  submitted:boolean = false;
  errorMessages:string[] =[];
  alertVisible:boolean = false;
  constructor(private accountService:AccountService,
    private sweetAlertService:SweetAlertService,
    private formBuilder:FormBuilder){}
  
    ngOnInit(): void {
      this.initializeForm();
    }
  
  initializeForm(){
    this.loginForm = this.formBuilder.group({
      userName:['',[Validators.required]],
      password:['',[Validators.required,Validators.minLength(6),Validators.maxLength(15)]]
    })
  }
  register(){
    this.submitted = true;
    // this.sweetAlertService.confirmBox({
    //   icon:'warning',
    //   html:'Text',
    //   title:'Title',
    //   confirmButtonText:'Tamam',
    //   showCancelButton:true,
    //   cancelButtonText:'İptal'
    // });
  
    this.errorMessages = [];
    this.accountService.login(this.loginForm.value).subscribe({
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
    if(this.loginForm.valid){
      
    }
  }
}
