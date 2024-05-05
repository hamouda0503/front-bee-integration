import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'any'
})
export class AvatarService {

  constructor(private http: HttpClient) { }

  getAvatar(styleName: string, seed: string) {
    return this.http.get(`/api/8.x/${styleName}/svg?seed=${seed}`, { responseType: 'blob' });
  }
}
