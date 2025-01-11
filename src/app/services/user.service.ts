import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { URLSearchParams } from 'url';
import { environment } from '../../environments/environment';
import { SignupBrand } from '../models/signup-brand';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  baseUrl = environment.baseUrl;


  // bagian ini untuk meng hit API login as brand
  // private baseUrl="http://localhost:8080/user/login";
  constructor(private httpClient: HttpClient, private router: Router) { }

  loginUser(email: String, password: String):Observable<object>{
    const payload = {email,password};
    // console.log(payload);
    return this.httpClient.post(this.baseUrl + "/user/login",payload);
  }

  // bagian ini untuk menredirect ke oauth
  private clientId="1204386434205570";
  private redirect="http://localhost:4200/login/interceptor";
  private scope="instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_insights,instagram_shopping_tag_products,pages_show_list,pages_read_engagement";
  private responseType="token";
  private oauthUrl="https://www.facebook.com/v21.0/dialog/oauth";

  loginInfluencer(){
    const authUrl = `${this.oauthUrl}?
    client_id=${this.clientId}&
    redirect_uri=${encodeURIComponent(this.redirect)}&
    scope=${this.scope}&
    response_type=${this.responseType}`;

    // redirect ke oauth
    window.location.href = authUrl;
  }

  // bagian ini untuk mendapatkan longlivedtoken
  longLivedToken: string | null = null;

  getToken(){
    const fragment = window.location.hash.substring(1);
    const params = new window.URLSearchParams(fragment);

    this.longLivedToken = params.get('long_lived_token');

    // console.log(this.longLivedToken);
    localStorage.setItem('long_lived_token', this.longLivedToken || '');
    // console.log(localStorage.getItem('long_lived_token'));
  }

  // bagian ini untuk kirim token ke backend
  // private tokenUrl="http://localhost:8080/user/token";
  sendToken(token: string):Observable<object>{
    console.log(token);
    return this.httpClient.post(this.baseUrl + "/user/token",{token});
  }

  signUpBrand(request: SignupBrand): Observable<object> {

    return this.httpClient.post(this.baseUrl + "/user/brand/signup",request);
  }

  validateEmail(request: String): Observable<string> {
    return this.httpClient.get(this.baseUrl + "/user/validation/email/" + request, {
      responseType: 'text'
    });
  }

}
