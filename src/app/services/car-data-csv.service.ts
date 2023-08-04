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

  getAllBy(formData: FormData): Observable<any> {
    const yearUrl = `${this.BASE_URL}/csv/report/getBy`
    return this.http.post(yearUrl,formData,{
      responseType: 'blob' as 'json', // Expecting a blob in response (PDF File)
      observe: 'response'
    });
  }

  groupByParameterCSV(formData: FormData): Observable<any> {
    const url = `${this.BASE_URL}/csv/report/group`;
    return this.http.post(url, formData, {
      responseType: 'blob' as 'json', // blob response (PDF File)
      observe: 'response'
    });
  }

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
