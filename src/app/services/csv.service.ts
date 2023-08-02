import { Injectable } from '@angular/core';
import * as Papa from 'papaparse';

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  constructor() { }

  extractOptions(data: any[]) {
    let makeOptions = [];
    let yearOptions = [];
    makeOptions = [...new Set(data.map(item => item.make))];
    yearOptions = [...new Set(data.map(item => item.year))];

    return {makeOptions, yearOptions};
  }

  parseFile(file: File, cb: (result: any) => void) {
    Papa.parse(file, {
      header: true,
      complete: cb
    });
  }

}
