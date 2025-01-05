import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl="http://localhost:8080/user/login";
  constructor(private httpClient: HttpClient) { }

  loginUser(email: String, password: String):Observable<object>{
    const payload = {email,password};
    // console.log(payload);
    return this.httpClient.post(`${this.baseUrl}`,payload);
  }
}
