import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

registerForm:FormGroup = new FormGroup({});
submitted:boolean = false;
errorMessages:string[] =[];
constructor(private accountService:AccountService,
  private formBuilder:FormBuilder){}

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
  console.log(this.registerForm.get('lastName')?.hasError('required'));
  console.log(this.registerForm.get('lastName')?.errors)
  if(this.registerForm.valid){
    console.log("valid");
    this.accountService.register(this.registerForm.value).subscribe({
      next:((response:any)=>{console.log(response)}),
      error:((error:any)=>{console.log(error.error["Message"])}),
      complete:(()=> console.log("register process completed!"))
    });
  }
}
}
