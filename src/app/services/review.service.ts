import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Review } from '../models/review';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private httpClient: HttpClient) { }
  baseUrl = environment.baseUrl;

  getReviewByInfluencerId(influencerId: string): Observable<any> {
      let params = new HttpParams();
      params = params.append("influencer-id", influencerId);
      return this.httpClient.get(this.baseUrl + "/review/influencer", {
        params: params
      });
  }

  createReview(request: Review): Observable<any> {
      return this.httpClient.post(this.baseUrl + "/review", request);
  }

  getReviewByProjectHeaderId(projectId: string): Observable<any> {
    let params = new HttpParams();
    params = params.append("project-header-id", projectId);
    return this.httpClient.get(this.baseUrl + "/review/project-header", {
      params: params
    });
}

}
