import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InfluencerService {
  baseUrl = environment.baseUrl;
  constructor(private httpClient: HttpClient, private router: Router) { }

  sendFilter(filters: any):Observable<object>{
    console.log(filters);
    return this.httpClient.post(this.baseUrl + "/influencer/filter",filters);
  }

}
