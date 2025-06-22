import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly API_URL = '/api/user/profile';
  constructor(private http: HttpClient) {}

  getProfile(): Observable<User> {
    return this.http.get<User>(this.API_URL);
  }

  updateProfile(user: User): Observable<User> {
    return this.http.put<User>(this.API_URL, user);
  }
} 