import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CarDataCsvService {

  private BASE_URL = environment.apiUrl;

  constructor(private http: HttpClient) { }


  getCSVDBMakeOptions(formData: FormData): Observable<any> {
    const yearUrl = `${this.BASE_URL}/csv/Car/makeOptions`;
    return this.http.post(yearUrl,formData,{
      responseType: 'json'
    });
  }
  getCSVYearOptions(formData: FormData): Observable<any> {
    const yearUrl = `${this.BASE_URL}/csv/Car/yearOptions`;
    return this.http.post(yearUrl,formData,{
      responseType: 'json'
    });
  }
}
