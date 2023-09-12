import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterVM } from '../shared/models/register';
import { BaseHttpService } from '../shared/services/base-http-service';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AccountService extends BaseHttpService{

  constructor(http: HttpClient) {
    super(http,"account"); // Provide the base URL
  }

  register(model:RegisterVM):Observable<void>{
    return this.post<RegisterVM,null>(model,"register");
  }
}
