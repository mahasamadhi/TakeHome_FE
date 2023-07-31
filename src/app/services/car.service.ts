import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  private BASE_URL = 'http://localhost:8080/api'; // change this to your Spring Boot API URL

  constructor(private http: HttpClient) { }

  csvToPdfByYear(formData: FormData): Observable<any> {
    const uploadUrl = `${this.BASE_URL}/report/csvToPdf/byYear`;
    return this.http.post(uploadUrl, formData, {
      responseType: 'blob' as 'json', // Expecting a blob in response (PDF File)
      observe: 'response'
    });
  }

  csvToPdfByMake(formData: FormData): Observable<any> {
    const uploadUrl = `${this.BASE_URL}/report/csvToPdf/byMake`;
    return this.http.post(uploadUrl, formData, {
      responseType: 'blob' as 'json', // Expecting a blob in response (PDF File)
      observe: 'response'
    });
  }

  getAllFromDBByYear(): Observable<any> {
    const getUrl = `${this.BASE_URL}/report/h2/groupByYear`; // adjust this to your actual endpoint
    return this.http.get(getUrl,{
      responseType: 'blob' as 'json', // Expecting a blob in response (PDF File)
      observe: 'response'
    });
  }

  getAllFromDBByMake(): Observable<any> {
    const getUrl = `${this.BASE_URL}/report/h2/groupByMake`; // adjust this to your actual endpoint
    return this.http.get(getUrl,{
      responseType: 'blob' as 'json', // Expecting a blob in response (PDF File)
      observe: 'response'
    });
  }

  getCarsByYear(year: number): Observable<any> {
    const yearUrl = `${this.BASE_URL}/report/22/year/${year}`;
    return this.http.get(yearUrl,{
      responseType: 'blob' as 'json', // Expecting a blob in response (PDF File)
      observe: 'response'
    });
  }
}
