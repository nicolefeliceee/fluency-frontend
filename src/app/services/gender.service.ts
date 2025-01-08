import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenderService {

  constructor(private httpClient: HttpClient) { }

    baseUrl = environment.baseUrl;

    getAllGender(): Observable<any> {
      return this.httpClient.get(this.baseUrl + "/gender");
    }
}
