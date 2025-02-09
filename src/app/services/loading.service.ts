import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor() { }

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  show(): void {
    console.log('loading start');
    this.loadingSubject.next(true);
  }

  hide(): void {
    console.log('loading end');
    this.loadingSubject.next(false);
  }
}
