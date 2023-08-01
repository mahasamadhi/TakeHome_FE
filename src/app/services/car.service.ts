import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  private BASE_URL = 'http://localhost:8080/api'; // change this to your Spring Boot API URL

  constructor(private http: HttpClient) { }

  insertCsvToDb(formData: FormData): Observable<any> {
    const uploadUrl = `${this.BASE_URL}/h2/insertCsv`;
    return this.http.post(uploadUrl, formData, {
      responseType: 'blob' as 'json', // Expecting a blob in response (PDF File)
      observe: 'response'
    });
  }

  deleteAllFromDb() {
    const uploadUrl = `${this.BASE_URL}/h2/deleteAll`;
    return this.http.delete(uploadUrl,{responseType: 'text'});
  }

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
    const yearUrl = `${this.BASE_URL}/report/h2/year/${year}`;
    return this.http.get(yearUrl,{
      responseType: 'blob' as 'json', // Expecting a blob in response (PDF File)
      observe: 'response'
    });
  }

  getH2MakeOptions(): Observable<any> {
    const yearUrl = `${this.BASE_URL}/h2/Car/makeOptions`;
    return this.http.get(yearUrl,{
      responseType: 'json'
    });
  }

  getH2YearOptions(): Observable<any> {
    const yearUrl = `${this.BASE_URL}/h2/Car/yearOptions`;
    return this.http.get(yearUrl,{
      responseType: 'json'
    });
  }
}
