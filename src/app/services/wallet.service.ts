import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  baseUrl = environment.baseUrl;

  constructor(
    private httpClient: HttpClient
  ) { }

  getWalletInfo():Observable<any>{
      const userId = localStorage.getItem('user_id');
      if (userId) {
        // Membuat URL dengan menyertakan user_id sebagai path variable
        const url = `${this.baseUrl}/wallet/info/${userId}`;
        return this.httpClient.get(url);  // Kirim GET request
      } else {
        throw new Error('User ID tidak ditemukan di Local Storage');
      }
    }

    checkout(amount: any, influencerId: any):Observable<any>{
      const userId = localStorage.getItem('user_id');
      let request = {
        nominal: amount,
        partnerId: influencerId
      }
      if (userId) {
        // Membuat URL dengan menyertakan user_id sebagai path variable
        const url = `${this.baseUrl}/wallet/checkout/${userId}`;
        return this.httpClient.post(url, request);  // Kirim GET request
      } else {
        throw new Error('User ID tidak ditemukan di Local Storage');
      }
    }

    disbursement(amount: any, influencerId: any, brandId: any):Observable<any>{
      let request = {
        nominal: amount,
        partnerId: influencerId
      }
      console.log(request);
      if (brandId) {
        // Membuat URL dengan menyertakan user_id sebagai path variable
        const url = `${this.baseUrl}/wallet/disbursement/${brandId}`;
        return this.httpClient.post(url, request);  // Kirim GET request
      } else {
        throw new Error('User ID tidak ditemukan di Local Storage');
      }
    }
}
