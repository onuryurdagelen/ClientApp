import { Component } from '@angular/core';
import { AccountService } from 'src/app/account/account.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(protected readonly accountService:AccountService){}

  logout(){
    this.accountService.logout();
  }
}
