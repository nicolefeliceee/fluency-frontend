import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { URLSearchParams } from 'url';
import { environment } from '../../environments/environment';
import { SignupBrand } from '../models/signup-brand';
import { SignupInfluencer } from '../models/signup-influencer';

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
  private clientId = "1204386434205570";
  private clientSecret = "03d0a9d4deadbfade7659460dee897c1";
  private redirect="http://localhost:4200/login/interceptor";
  private scope="instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_insights,instagram_shopping_tag_products,pages_show_list,pages_read_engagement";
  private responseType="token";
  private oauthUrl = "https://www.facebook.com/v21.0/dialog/oauth";
  private grantType = "fb_exchange_token";
  private accessTokenUrl = "https://graph.facebook.com/v21.0/oauth/access_token";

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

  accessToken: string | null = null;

  async getToken(){
    const fragment = window.location.hash.substring(1);
    console.log(fragment);
    const params = new window.URLSearchParams(fragment);

    console.log(params);
    this.accessToken = params.get('access_token');
    console.log(params.get('access_token'));

    this.getLongLivedToken().subscribe(
      (data) => {
        console.log(data);
        localStorage.setItem('long_lived_token', (data as any)['access_token']);
        console.log("latest long lived token");
        console.log(localStorage.getItem('long_lived_token'));
      }
    );

    // console.log(this.longLivedToken);
    // console.log(localStorage.getItem('long_lived_token'));
  }

  getLongLivedToken() {
    let params = new HttpParams();
    params = params.append('grant_type', this.grantType);
    params = params.append('client_id', this.clientId);
    params = params.append('client_secret', this.clientSecret);
    params = params.append('fb_exchange_token', this.accessToken || '');

    console.log(params);

    return this.httpClient.get(this.accessTokenUrl, {
      params: params
    });

  }

  // bagian ini untuk kirim token ke backend
  // private tokenUrl="http://localhost:8080/user/token";
  sendToken(token: string):Observable<object>{
    console.log(token);
    return this.httpClient.post(this.baseUrl + "/user/token",{token});
  }

  signUpBrand(request: FormData): Observable<object> {
    // const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW');
    return this.httpClient.post(this.baseUrl + "/user/brand/signup", request, {
      // headers: headers
    });
  }

  editProfileBrand(request: FormData): Observable<object> {
    return this.httpClient.put(this.baseUrl + "/user/brand/profile/" + localStorage.getItem("user_id"), request);
  }

  signUpInfluencer(request: SignupInfluencer): Observable<object> {
    return this.httpClient.post(this.baseUrl + "/user/influencer/signup",request);
  }

  editProfileInfluencer(request: SignupInfluencer): Observable<object> {
    return this.httpClient.put(this.baseUrl + "/user/influencer/profile/" + localStorage.getItem("user_id"), request);
  }

  validateEmail(request: String): Observable<string> {
    return this.httpClient.get(this.baseUrl + "/user/validation/email/" + request, {
      responseType: 'text'
    });
  }

  getProfile(userId: string): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/user/profile/" + userId);
  }

  getAllUser():Observable<any>{
    return this.httpClient.get(this.baseUrl + "/user/all");
  }

  toggleBlock(id: number, newStatus: string): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/user/block/${id}`, { status: newStatus });
  }

}
