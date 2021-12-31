import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { shareReplay, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from './user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$?: Observable<User>

  constructor(private http: HttpClient) {
  }

  signIn (email: string, password: string) {
    this.user$ = this.http.post<User>('/api/auth/sign-in', { email, password })
      .pipe(
        shareReplay()
      )
  }
}
