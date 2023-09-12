import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export abstract class BaseHttpService {
    baseUrl = environment.apiUrl;
    constructor(protected http: HttpClient,private endPoint:string) {
        this.baseUrl += `${this.endPoint}`; 
    }

    // Common GET method
    get<TResponse>(id: number): Observable<TResponse | void> {
      const url = `${this.baseUrl}/${id}`;
      return this.http.get<TResponse |void>(url);
    }
  
    // Common POST method
    post<TRequest,TResponse>(item: TRequest,actionName:String): Observable<TResponse | void> {
      return this.http.post<TResponse |void>(this.baseUrl + `/${actionName}`, item);
    }
  
    // Common PUT method
    put<TRequest,TResponse>(id: number, item: TRequest): Observable<TResponse | void> {
      const url = `${this.baseUrl}/${id}`;
      return this.http.put<TResponse | void>(url, item);
    }
  
    // Common DELETE method
    delete<TResponse>(id: number): Observable<TResponse | void> {
      const url = `${this.baseUrl}/${id}`;
      return this.http.delete<TResponse | void>(url);
    }

}
