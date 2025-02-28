import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

interface Category {
  id: number; // ID kategori
  label: string; // Nama kategori
}

interface Influencer {
  id: number; // ID dari user (integer)
  name: string; // Nama user
  email: string; // Email user
  location: string; // Label lokasi
  phone: string; // Nomor telepon
  gender: string; // Gender label
  dob: string; // Tanggal lahir (string, dalam format ISO/Date)
  feedsprice: string; // Harga feed
  reelsprice: string; // Harga reels
  storyprice: string; // Harga story
  category: Category[];
  usertype: string; // Tipe user
  instagramid: string; // ID Instagram
  isactive: boolean; // Status aktif
  token: string; // Token
  followers: string;
  rating: number;
  totalreview: string;
  minprice: string;
  profilepicture: string;
}

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

  sendFilterSaved(filters: any):Observable<any>{
    console.log(filters);
    const userId = localStorage.getItem('user_id');
    if (userId) {
      // Membuat URL dengan menyertakan user_id sebagai path variable
      const url = `${this.baseUrl}/influencer/filter/saved/${userId}`;
      return this.httpClient.post(url, filters);  // Kirim GET request
    } else {
      throw new Error('User ID tidak ditemukan di Local Storage');
    }
  }

  sendSortOptionSaved(filters2: any): Observable<any> {
    // console.log( { sort: sortValue } );
    console.log(filters2);
    const userId = localStorage.getItem('user_id');
    if (userId) {
      // Membuat URL dengan menyertakan user_id sebagai path variable
      const url = `${this.baseUrl}/influencer/sort/saved/${userId}`;
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

  // getInfluencerCategory(status: string, userId: string, influencer: Influencer[]): Observable<any> {
  //   console.log("id: " + userId);
  //   console.log("status: " + status);
  //   console.log("influencer: " + JSON.stringify(influencer,null,2));
  //   let params = new HttpParams();
  //   params = params.append("status", status);
  //   return this.httpClient.post(this.baseUrl + "/influencer/category/" + userId, influencer, {
  //     params: params
  //   });
  // }

  getInfluencerById(influencerId: number): Observable<any> {
    let url = this.baseUrl + '/influencer/' + influencerId;
    return this.httpClient.get(url);
  }

  searchInfluencers(query: string): Observable<any> {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      return this.httpClient.get(`${this.baseUrl}/influencer/search/${userId}?query=${query}`);
    } else {
      throw new Error('User ID tidak ditemukan di Local Storage');
    }
  }

  searchInfluencersSaved(query: string): Observable<any> {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      return this.httpClient.get(`${this.baseUrl}/influencer/saved/search/${userId}?query=${query}`);
    } else {
      throw new Error('User ID tidak ditemukan di Local Storage');
    }
  }

  getDetailInfluencer(influencerId: string): Observable<any> {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      return this.httpClient.get(`${this.baseUrl}/influencer/detail/${influencerId}/${userId}`);
    } else {
      throw new Error('User ID tidak ditemukan di Local Storage');
    }
  }

  getHomeInfluencer(): Observable<any> {
    const userId = localStorage.getItem('user_id');
    // const userId = "48";
    console.log ("userId: " + userId);
    if (userId) {
      return this.httpClient.get(`${this.baseUrl}/influencer/home/${userId}`);
    } else {
      throw new Error('User ID tidak ditemukan di Local Storage');
    }
  }

  checkProfileCompletion(influencerId: number): Observable<{ profileCompleted: boolean }> {
    return this.httpClient.get<{ profileCompleted: boolean }>(`${this.baseUrl}/influencer/check-profile/${influencerId}`);
  }

  checkProject(influencerId: number): Observable<{ projectCompleted: boolean }> {
    return this.httpClient.get<{ projectCompleted: boolean }>(`${this.baseUrl}/influencer/check-project/${influencerId}`);
  }

  updateInfluencerStatus(influencerId: number, isActive: boolean): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/influencer/update-status/${influencerId}`, { isactive: isActive });
  }

  getProject(influencerId: number, date: Date): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/influencer/get-project/${influencerId}`, {date});
  }

  addChat(influencerId: number){
    const userId = localStorage.getItem('user_id');
    if (userId) {
      const paramsObject = {
        brandId: userId,
        influencerId: influencerId
      };
      const params = new HttpParams({ fromObject: paramsObject });
      return this.httpClient.get(`${this.baseUrl}/chat/add`, {params});
    } else {
      throw new Error ('Logged User ID tidak ditemukan di Local Storage')
    }
  }
}
