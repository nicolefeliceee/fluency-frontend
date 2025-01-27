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

  // for logged in user: influencer !!
  getProfile(token: any, instagramId: any): Observable<any> {

    let params = new HttpParams();
    params = params.append('fields', 'profile_picture_url,username,followers_count');
    params = params.append('access_token', token);

    return this.httpClient.get(this.baseUrl + "/" + instagramId, {
      params: params
    });

  }
}
