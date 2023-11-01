import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseHttpService } from 'src/app/shared/services/base-http-service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlayService extends BaseHttpService{

  constructor(http:HttpClient) {
    super(http,'/play');
   }

   getPlayers(){
    return this.http.get(`${environment.apiUrl}/play/get-players`)
   }
}
