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

  getRecommendation():Observable<any>{
    const userId = localStorage.getItem('user_id');
    if (userId) {
      // Membuat URL dengan menyertakan user_id sebagai path variable
      const url = `${this.baseUrl}/influencer/recommendation/${userId}`;
      return this.httpClient.get(url);  // Kirim GET request
    } else {
      throw new Error('User ID tidak ditemukan di Local Storage');
    }
}

  sendFilter(filters: any):Observable<any>{
    console.log(filters);
    const userId = localStorage.getItem('user_id');
    if (userId) {
      // Membuat URL dengan menyertakan user_id sebagai path variable
      const url = `${this.baseUrl}/influencer/filter/${userId}`;
      return this.httpClient.post(url, filters);  // Kirim GET request
    } else {
      throw new Error('User ID tidak ditemukan di Local Storage');
    }
  }

  sendSortOption(filters2: any): Observable<any> {
    // console.log( { sort: sortValue } );
    console.log(filters2);
    const userId = localStorage.getItem('user_id');
    if (userId) {
      // Membuat URL dengan menyertakan user_id sebagai path variable
      const url = `${this.baseUrl}/influencer/sort/${userId}`;
      return this.httpClient.post(url, filters2);  // Kirim GET request
    } else {
      throw new Error('User ID tidak ditemukan di Local Storage');
    }
  }

  saveInfluencer(influencerUserId: number): Observable<any> {
    const brandUserId = localStorage.getItem('user_id');
      if (brandUserId) {
        // Membuat URL dengan menyertakan user_id sebagai path variable
        const url = `${this.baseUrl}/influencer/save/${brandUserId}`;
        return this.httpClient.post(url, {influencerUserId});
      } else {
        throw new Error('User ID tidak ditemukan di Local Storage');
      }
  }

  unsaveInfluencer(influencerUserId: number): Observable<any> {
    const brandUserId = localStorage.getItem('user_id');
      if (brandUserId) {
        // Membuat URL dengan menyertakan user_id sebagai path variable
        const url = `${this.baseUrl}/influencer/unsave/${brandUserId}`;
        return this.httpClient.post(url, {influencerUserId});
      } else {
        throw new Error('User ID tidak ditemukan di Local Storage');
      }
  }

}
