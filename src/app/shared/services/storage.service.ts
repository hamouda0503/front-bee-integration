import { Injectable } from '@angular/core';
import { User } from '../model/user.model';

const ACCESS_TOKEN_KEY = 'auth-token';
const REFRESH_TOKEN_KEY = 'auth-refresh-token';
const USER_INFO_KEY = 'auth-user-info';

@Injectable({
  providedIn: 'any'
})
export class StorageService {
  constructor() {}

  clean(): void {
    this.clearTokens();
  }

  public saveTokensAndUserInfo(accessToken: string, refreshToken: string, userInfo: any): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    


    // const filteredUserInfo = {
    //   id: userInfo.id,
    //   firstName: userInfo.firstname,
    //   lastName: userInfo.lastname,
    //   imageUrl:userInfo.imageUrl,
    //   email: userInfo.email,
    //   role: userInfo.role,
    //   enabled: userInfo.enabled, // Adjust based on your needs
    // };
    
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
  }

  public getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  public clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);
  }

  public SetUser(user:any) {
   localStorage.setItem(USER_INFO_KEY,JSON.stringify(user));
    // Empty user object
  }


  public isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }
  public getUser(): any {
    const userInfo = localStorage.getItem(USER_INFO_KEY);
    if (userInfo) {
      return JSON.parse(userInfo);
    }
    // return new User(); // Empty user object
  }
  public getUser2(): User {
    const userInfo = localStorage.getItem(USER_INFO_KEY);
    if (userInfo) {
      return JSON.parse(userInfo);
    }
    // return new User(); // Empty user object
  }
}
