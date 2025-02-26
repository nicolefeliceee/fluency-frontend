import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MidtransService {

  constructor(private httpClient: HttpClient) { }

  baseUrl = environment.baseUrl;

  getTransactionToken(orderId: any, amount: number): Observable<any> {
    return this.httpClient.post(
      this.baseUrl + "/midtrans/get-token",
      {
        id: orderId,
        amount: amount
      },
      {
        responseType: 'text'
      }
    );
  }

  // createPaymentLink(orderId: any): Observable<{ paymentUrl: string }> {
  //   const requestData = { orderId };
  //   return this.httpClient.post<{ paymentUrl: string }>(
  //     this.baseUrl + "/midtrans/topup", requestData);
  // }

}
