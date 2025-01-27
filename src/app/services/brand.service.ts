import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  baseUrl = environment.baseUrl;
  constructor(private httpClient: HttpClient) { }

  getBrandById(brandId: string): Observable<any>{
    return this.httpClient.get(this.baseUrl + '/brand/' + brandId);
  }

}
