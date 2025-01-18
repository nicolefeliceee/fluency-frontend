import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProjectCreate } from '../models/project-create';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

    constructor(private httpClient: HttpClient) { }

    baseUrl = environment.baseUrl;

  getProjects(status: string, userId: string): Observable<any> {
    let params = new HttpParams();
    params = params.append("status", status);
          return this.httpClient.get(this.baseUrl + "/project/" + userId, {
            params: params
          });
  }

  createProject(request: ProjectCreate): Observable<any> {
    return this.httpClient.post(this.baseUrl + "/project", request);
  }
}
