import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { User } from 'src/app/shared/models/account/user';
import { ResetPassword } from 'src/app/shared/models/account/resetPassword';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  token: string | undefined;
  emailAddress: string | undefined;
  errorMessages: string[] = [];

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.accountService.user$.pipe(take(1)).subscribe({
      next: (user: User | null) => {
        if (user) {
          this.router.navigateByUrl('/');
        } else {
          this.token = this.activatedRoute.snapshot.paramMap.get('token');
          this.emailAddress =
            this.activatedRoute.snapshot.paramMap.get('emailAddress');
          if (this.token && this.emailAddress) {
            this.initializeForm(this.emailAddress);
          } else {
            this.router.navigateByUrl('/');
          }
        }
      },
    });
  }
  initializeForm(emailAddress: string) {
    this.resetPasswordForm = this.formBuilder.group({
      emailAddress: [{ value: emailAddress, disabled: true }],
      newPassword: [
        '',
        [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(15),
          ],
        ],
      ],
    });
  }
  resetPassword() {
    this.submitted = true;
    this.errorMessages = [];

    if (this.resetPasswordForm.valid && this.emailAddress && this.token) {
      const model: ResetPassword = {
        emailAddress: this.resetPasswordForm.get('emailAddress')?.value,
        token: this.token,
        newPassword: this.resetPasswordForm.get('newPassword')?.value,
      };
      this.accountService.resetPassword(model).subscribe({
        next: (response: any) => {
          console.log(response);
          this.router.navigateByUrl('/account/login');
        },
        error: (error: any) => {
          if (error.error.errors) {
            this.errorMessages = error.error.errors;
          } else {
            this.errorMessages.push(error.error);
          }
          console.log(this.errorMessages);
        },
        complete: () => console.log('register process completed!'),
      });
    }
  }
}
