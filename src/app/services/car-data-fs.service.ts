import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
/*
This service holds the endpoints for car data that is retrieved from the filesystem
 */
export class CarDataFsService {
  constructor(private http: HttpClient) { }

  private BASE_URL = environment.apiUrl;

  //GROUP BY

  groupBySaveToFs(formData: FormData): Observable<any> {
    const url = `${this.BASE_URL}/fs/report/group/saveToFs`;
    return this.http.post(url, formData, {
      responseType: 'json'
    });
  }

  groupByDownload(formData: FormData): Observable<any> {
    const url = `${this.BASE_URL}/fs/report/group/download`;
    return this.http.post(url, formData, {
      responseType: 'blob' as 'json', // blob response (PDF File)
      observe: 'response'
    });
  }


}
