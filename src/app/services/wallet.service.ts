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
}
