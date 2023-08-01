import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Form} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class CarService {

  private BASE_URL = 'http://localhost:8080/api'; // change this to your Spring Boot API URL

  constructor(private http: HttpClient) { }

//CSV Source

  //GROUP BY

  groupByParameterCSV(formData: FormData): Observable<any> {
  const url = `${this.BASE_URL}/report/csv/group`;
  return this.http.post(url, formData, {
    responseType: 'blob' as 'json', // blob response (PDF File)
    observe: 'response'
  });
  }

  //FILTER BY

  getAllByYearCSV(year: number, formData: FormData,sortDir: string): Observable<any> {
    const yearUrl = `${this.BASE_URL}/report/csv/year/${year}/${sortDir}`;
    return this.http.post(yearUrl,formData,{
      responseType: 'blob' as 'json', // Expecting a blob in response (PDF File)
      observe: 'response'
    });
  }

  getAllByMakeCSV(make: string, formData: FormData,sortDir: string): Observable<any> {
  const yearUrl = `${this.BASE_URL}/report/csv/make/${make}/${sortDir}`;
  return this.http.post(yearUrl,formData,{
    responseType: 'blob' as 'json', // Expecting a blob in response (PDF File)
    observe: 'response'
  });
}

getCarsLessThanCSV(price: number, formData: FormData, sortDir: string): Observable<any> {
  const yearUrl = `${this.BASE_URL}/report/csv/price/${price}/${sortDir}`;
  return this.http.post(yearUrl,formData,{
    responseType: 'blob' as 'json', // Expecting a blob in response (PDF File)
    observe: 'response'
  });
}


//DATABASE Source

  //GROUP BY
  groupByDB(groupBy: string, sortDir: string): Observable<any> {
    const url = `${this.BASE_URL}/report/h2/group/${groupBy}/${sortDir}`;
    return this.http.get(url,{
      responseType: 'blob' as 'json', // Expecting a blob in response (PDF File)
      observe: 'response'
    });
  }

  //FILTER BY
  getAllByYearDB(year: number,sortDir: string): Observable<any> {
    const yearUrl = `${this.BASE_URL}/report/h2/year/${year}/${sortDir}`;
    return this.http.get(yearUrl,{
      responseType: 'blob' as 'json', // Expecting a blob in response (PDF File)
      observe: 'response'
    });
  }

  getAllByMakeDB(make: string, sortDir: string ): Observable<any> {
    const makeUrl = `${this.BASE_URL}/report/h2/make/${make}/${sortDir}`;
    return this.http.get(makeUrl,{
      responseType: 'blob' as 'json', // Expecting a blob in response (PDF File)
      observe: 'response'
    });
  }
  getCarsLessThanDB(price: number, sortDir: string): Observable<any> {
    const priceUrl = `${this.BASE_URL}/report/h2/price/${price}/${sortDir}`;
    return this.http.get(priceUrl,{
      responseType: 'blob' as 'json', // Expecting a blob in response (PDF File)
      observe: 'response'
    });
  }

//OTHER DATABASE OPERATIONS
getDBMakeOptions(): Observable<any> {
  const yearUrl = `${this.BASE_URL}/h2/Car/makeOptions`;
  return this.http.get(yearUrl,{
    responseType: 'json'
  });
}
getDBYearOptions(): Observable<any> {
  const yearUrl = `${this.BASE_URL}/h2/Car/yearOptions`;
  return this.http.get(yearUrl,{
    responseType: 'json'
  });
}
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
}
