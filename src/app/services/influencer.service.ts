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

  sendFilter(filters: any):Observable<any>{
    console.log(filters);
    return this.httpClient.post(this.baseUrl + "/influencer/filter",filters);
  }

  sendSortOption(filters2: any): Observable<any> {
    // console.log( { sort: sortValue } );
    console.log(filters2);
    return this.httpClient.post(this.baseUrl + "/influencer/sort", filters2);
  }

}
