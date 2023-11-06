import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { User } from 'src/app/shared/models/account/user';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.css'],
})
export class SendEmailComponent implements OnInit {
  emailForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  errorMessages: string[] = [];
  mode: string | undefined;

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
          const mode = this.activatedRoute.snapshot.paramMap.get('mode');
          if (mode) {
            this.mode = mode;
            console.log(this.mode);
            this.initializeForm();
          }
        }
      },
    });
  }
  initializeForm() {
    this.emailForm = this.formBuilder.group({
      emailAddress: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$'),
        ],
      ],
    });
  }
  sendEmail() {
    this.submitted = true;
    this.errorMessages = [];

    if (this.emailForm.valid || this.mode) {
      if (this.mode.includes('resend-email-confirmation-link')) {
        this.accountService
          .reSendEmailConfirmationLink(
            this.emailForm.get('emailAddress')?.value
          )
          .subscribe({
            next: (response: any) => {
              console.log(response);
              this.router.navigateByUrl('/account/login');
            },
            error: (error: any) => {
              if (error.error.errors) {
                this.errorMessages = error.error.errors;
              } else {
                this.errorMessages.push(error.error.Message);
              }
              console.log(this.errorMessages);
            },
            complete: () => console.log('resend-email-confirmation-link process completed!'),
          });
      } else if (this.mode.includes('forgot-username-or-password')) {
        this.accountService
          .forgotUsernameOrPassword(this.emailForm.get('emailAddress')?.value)
          .subscribe({
            next: (response: any) => {
              console.log(response);
            },
            error: (error: any) => {
              console.log(error);
              if (error.error.errors) {
                this.errorMessages = error.error.errors;
              } else {
                this.errorMessages.push(error.error);
              }
              console.log(this.errorMessages);
            },
            complete: () => console.log('forgot-username-or-password process completed!'),
          });
      }
    }
  }
}
