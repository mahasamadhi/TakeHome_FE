import { Component, EventEmitter, Input, Output } from '@angular/core';
import {CarDataDbService} from "../services/car-data-db.service";
import {CsvService} from "../services/csv.service";
import {CarDataFsService} from "../services/car-data-fs.service";
import {CarDataCsvService} from "../services/car-data-csv.service";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {
  @Input() isFilterActive = false;
  @Input() makeOptions: string[] = [];
  @Input() yearOptions: string[] = [];
  @Input() selectedDatasource!: string;

  // fileToUpload: File | null;

  @Output() filterButtonClick: EventEmitter<string> = new EventEmitter();
  @Output() selectedFilterByOptionChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() selectedMakeChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() selectedYearChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() priceFilterChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() errorMsg = new EventEmitter<string>();


  selectedFilterByOption = 'Make';
  selectedMake = "";
  selectedYear = "";
  priceFilter = 0;
  constructor( private dbData: CarDataDbService, private  csvData: CarDataCsvService) { }

  onFilterButtonClick(): void {
    if(this.selectedDatasource == 'fs') {
      this.filterButtonClick.emit("Feature Not Available");
    } else {
      this.filterButtonClick.emit("");
    }
  }

  populateDBOptions(ds: string,file?: File ) {
    this.populateMakeOptions(ds, file);
    this.populateYearOptions(ds, file);
  }

  populateMakeOptions(ds: string,file?: File ) {
    if (ds == 'csv') {
      if (file) {
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        this.csvData.getCSVDBMakeOptions(formData).subscribe((data)=>{
          this.makeOptions = data.makeOptions;
        })
      } else {
        this.errorMsg.emit('Error: no file selected') ;
      }
    }

    if (ds == 'h2') {
      this.dbData.getDBMakeOptions().subscribe((data)=>{
        this.makeOptions = data.makeOptions;
      })
    }

  }

  populateYearOptions( ds: string,file?: File) {
    if (ds == 'csv') {
      if (file) {
        const formData: FormData = new FormData();
        formData.append('file', file,file.name);
        this.csvData.getCSVYearOptions(formData).subscribe((data)=>{
          this.yearOptions = data.yearOptions;
        })
      } else {
        this.errorMsg.emit('Error: no file selected') ;
      }

    }
    if (ds == 'h2') {
      this.dbData.getDBYearOptions().subscribe((data) => {
        this.yearOptions = data.yearOptions;
      })
    }
  }

  clearOptions() {
    this.makeOptions = [];
    this.yearOptions = [];
  }

}
