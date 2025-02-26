import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  baseUrl = environment.baseUrl;
  constructor(private httpClient: HttpClient, private router: Router) { }


  getTopInfluencer():Observable<any>{
      const userId = localStorage.getItem('user_id');
      if (userId) {
        // Membuat URL dengan menyertakan user_id sebagai path variable
        const url = `${this.baseUrl}/influencer/top-influencer/${userId}`;
        return this.httpClient.get(url);  // Kirim GET request
      } else {
        throw new Error('User ID tidak ditemukan di Local Storage');
      }
  }
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

  transfer(amount: any):Observable<any>{
    console.log(amount);
    const userId = localStorage.getItem('user_id');
    // const userId = "48";
    if (userId) {
      // Membuat URL dengan menyertakan user_id sebagai path variable
      const url = `${this.baseUrl}/wallet/transfer/${userId}`;
      return this.httpClient.post(url, amount);  // Kirim GET request
    } else {
      throw new Error('User ID tidak ditemukan di Local Storage');
    }
  }

  getWalletInfo():Observable<any>{
    const userId = localStorage.getItem('user_id');
    // const userId = "48";
    if (userId) {
      // Membuat URL dengan menyertakan user_id sebagai path variable
      const url = `${this.baseUrl}/wallet/info/${userId}`;
      return this.httpClient.get(url);  // Kirim GET request
    } else {
      throw new Error('User ID tidak ditemukan di Local Storage');
    }
  }

  topup(amount: any):Observable<any>{
    console.log(amount);
    const userId = localStorage.getItem('user_id');
    // const userId = "48";
    if (userId) {
      // Membuat URL dengan menyertakan user_id sebagai path variable
      const url = `${this.baseUrl}/wallet/topup/${userId}`;
      return this.httpClient.post(url, amount);  // Kirim GET request
    } else {
      throw new Error('User ID tidak ditemukan di Local Storage');
    }
  }
}
