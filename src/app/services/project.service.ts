import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProjectCreate } from '../models/project-create';
import { ProjectDetail } from '../models/project-detail';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

    constructor(private httpClient: HttpClient) { }

    baseUrl = environment.baseUrl;

  getProjects(status: string | null, userId: string, title: string | null): Observable<any> {
    let params = new HttpParams();
    params = params.append("status", status || '');
    params = params.append("title", title || '');
          return this.httpClient.get(this.baseUrl + "/project/" + userId, {
            params: params
          });
  }

  getProjectbyId(id: any): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/project/header-id/" + id);
  }

  getProjectDetailById(id: any): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/project/detail/detail-id/" + id);
  }

  getPerformanceAnalyticsById(projectDetailId: any): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/project/performance-analytics/" + projectDetailId);
  }

  getSentimentById(projectDetailId: any): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/project/sentiment-analysis/" + projectDetailId);
  }


  createProject(request: ProjectCreate): Observable<any> {
    return this.httpClient.post(this.baseUrl + "/project", request);
  }

  editProject(request: ProjectCreate): Observable<any> {
    return this.httpClient.put(this.baseUrl + "/project", request);
  }

  editProjectDetail(request: ProjectDetail): Observable<any> {
    return this.httpClient.put(this.baseUrl + "/project/detail", request);
  }

  verifyLink(influencerId: string, link: string): Observable<any> {
    let params = new HttpParams();
    params = params.append("influencer-id", influencerId);
    params = params.append("link", link);
    return this.httpClient.get(this.baseUrl + "/project/verify-link", {
      params: params
    },
    );
  }

  deleteProjectbyId(id: any): Observable<any> {
    return this.httpClient.delete(this.baseUrl + "/project/" + id);
  }

}
