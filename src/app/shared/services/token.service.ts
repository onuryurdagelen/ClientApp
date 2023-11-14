import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../models/account/user';
import { RefreshTokenDto, UserDto } from '../dtos/userDto';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  getUser(): UserDto | null {
    // Implement logic to retrieve the access token from storage
    return JSON.parse(localStorage.getItem(environment.userKey));
  }

  setAccessToken(token: string): void {
    // Implement logic to store the access token securely
    localStorage.setItem('access_token', token);
  }

  getRefreshToken(): RefreshTokenDto | null {
    // Implement logic to retrieve the refresh token from storage
    return JSON.parse(localStorage.getItem(environment.refreshTokenKey));
  }

  setRefreshToken(token: string): void {
    // Implement logic to store the refresh token securely
    localStorage.setItem('refresh_token', token);
  }
  
}
