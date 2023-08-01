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

  //CSV Source
  getAllByYearCSV( sortDir: string, formData: FormData): Observable<any> {
    const Url = `${this.BASE_URL}/report/csv/groupByYear/${sortDir}`;
    return this.http.post(Url, formData, {
      responseType: 'blob' as 'json', // Expecting a blob in response (PDF File)
      observe: 'response'
    });
  }

  getAllByMakeCSV(sortDir: string, formData: FormData): Observable<any> {
    const getUrl = `${this.BASE_URL}/report/csv/groupByMake/${sortDir}`; // adjust this to your actual endpoint
    return this.http.post(getUrl,formData,{
      responseType: 'blob' as 'json', // Expecting a blob in response (PDF File)
      observe: 'response'
    });
  }

  //DATABASE Source

  getAllByMakeDB(sortDir: string): Observable<any> {
    const getUrl = `${this.BASE_URL}/report/h2/groupByMake/${sortDir}`; // adjust this to your actual endpoint
    return this.http.get(getUrl,{
      responseType: 'blob' as 'json', // Expecting a blob in response (PDF File)
      observe: 'response'
    });
  }

  getAllByYearDB(sortDir: string): Observable<any> {
    const yearUrl = `${this.BASE_URL}/report/h2/groupByYear/${sortDir}`;
    return this.http.get(yearUrl,{
      responseType: 'blob' as 'json', // Expecting a blob in response (PDF File)
      observe: 'response'
    });
  }

  getCarsByYear(year: number, dataSource: string): Observable<any> {
    const yearUrl = `${this.BASE_URL}/report/${dataSource}/year/${year}`;
    return this.http.get(yearUrl,{
      responseType: 'blob' as 'json', // Expecting a blob in response (PDF File)
      observe: 'response'
    });
  }

  getCarsByMake(make: string, dataSource: string): Observable<any> {
    const makeUrl = `${this.BASE_URL}/report/${dataSource}/make/${make}`;
    return this.http.get(makeUrl,{
      responseType: 'blob' as 'json', // Expecting a blob in response (PDF File)
      observe: 'response'
    });
  }
  getAllCarsLessThan(price: number, dataSource: string): Observable<any> {
    const priceUrl = `${this.BASE_URL}/report/${dataSource}/price/${price}`;
    return this.http.get(priceUrl,{
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
