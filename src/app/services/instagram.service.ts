import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstagramService {
  constructor(private httpClient: HttpClient) { }
  baseUrl = environment.instagramBaseUrl;

  getProfile(): Observable<any> {

    let params = new HttpParams();
    params = params.append('fields', 'profile_picture_url,username');
    params = params.append('access_token', localStorage.getItem('long_lived_token') || '');

    return this.httpClient.get(this.baseUrl + "/" + localStorage.getItem('instagram_id'), {
      params: params
    });

  }
}
