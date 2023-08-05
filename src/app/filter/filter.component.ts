import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {CarDataDbService} from "../services/car-data-db.service";
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
  @Input() fileToUpload: File | null = null;

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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedDatasource']) {
      this.handleDatasourceChanges()
    }
    if (changes['fileToUpload']) {
    this.handleFileChanges();
    }
  }

  handleDatasourceChanges() {
    this.clearOptions();
    if (this.selectedDatasource == 'h2') {
      this.populateDBOptions();
    }
  }

  handleFileChanges() {
    if(this.fileToUpload) {
      this.populateDBOptions();
    }
  }

  onFilterButtonClick(): void {
    if(this.selectedDatasource == 'fs') {
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
    if (this.selectedDatasource == 'csv') {
      if (this.fileToUpload) {
        const formData: FormData = new FormData();
        formData.append('file', this.fileToUpload!, this.fileToUpload!.name);
        this.csvData.getCSVDBMakeOptions(formData).subscribe((data)=>{
          this.makeOptions = data.makeOptions;
        })
      } else {
        this.errorMsg.emit('Error: no file selected') ;
      }
    }

    if (this.selectedDatasource == 'h2') {
      this.dbData.getDBMakeOptions().subscribe((data)=>{
        this.makeOptions = data.makeOptions;
      })
    }

  }

  populateYearOptions() {
    if (this.selectedDatasource == 'csv') {
      if (this.fileToUpload) {
        const formData: FormData = new FormData();
        formData.append('file', this.fileToUpload!,this.fileToUpload!.name);
        this.csvData.getCSVYearOptions(formData).subscribe((data)=>{
          this.yearOptions = data.yearOptions;
        })
      } else {
        this.errorMsg.emit('Error: no file selected') ;
      }

    }
    if (this.selectedDatasource == 'h2') {
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
