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

  @Input()
  set selectedDatasource(val: string){
    this._selectedDatasource = val;
    this.clearOptions();
    if (val == 'h2') {
      this.populateDBOptions();
    }
  }
  _selectedDatasource!: string;

  @Input()
  set fileToUpload(file: File | null) {
    if(file) {
      this._fileToUpload = file
      this.populateDBOptions();
    }

  }
  _fileToUpload: File | null = null;

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
    if(this._selectedDatasource == 'fs') {
      this.filterButtonClick.emit("Feature Not Available");
    } else {
      this.filterButtonClick.emit("");
    }
  }

  populateDBOptions() {
    this.populateMakeOptions();
    this.populateYearOptions();
  }

  populateMakeOptions() {
    if (this._selectedDatasource == 'csv') {
      if (this._fileToUpload) {
        const formData: FormData = new FormData();
        formData.append('file', this._fileToUpload!, this._fileToUpload!.name);
        this.csvData.getCSVDBMakeOptions(formData).subscribe((data)=>{
          this.makeOptions = data.makeOptions;
        })
      } else {
        this.errorMsg.emit('Error: no file selected') ;
      }
    }

    if (this._selectedDatasource == 'h2') {
      this.dbData.getDBMakeOptions().subscribe((data)=>{
        this.makeOptions = data.makeOptions;
      })
    }

  }

  populateYearOptions() {
    if (this._selectedDatasource == 'csv') {
      if (this._fileToUpload) {
        const formData: FormData = new FormData();
        formData.append('file', this._fileToUpload!,this._fileToUpload!.name);
        this.csvData.getCSVYearOptions(formData).subscribe((data)=>{
          this.yearOptions = data.yearOptions;
        })
      } else {
        this.errorMsg.emit('Error: no file selected') ;
      }

    }
    if (this._selectedDatasource == 'h2') {
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
