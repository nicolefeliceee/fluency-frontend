import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private httpClient: HttpClient) { }

  baseUrl = environment.baseUrl;

  getAllCategories(): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/category");
  }



}
