import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {CarDataDbService} from "../services/car-data-db.service";
import {CarDataCsvService} from "../services/car-data-csv.service";
import {MessageService} from "../services/message.service";
import {saveAs} from "file-saver";

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



  selectedFilterByOption = 'Make';
  selectedMake = "";
  selectedYear = "";
  priceFilter = 0;
  constructor( private dbData: CarDataDbService, private  csvData: CarDataCsvService, private messageService: MessageService) { }

  //Handling when the input variables have changes from the parent

  //Alternative design: use a service with a behavior subject
  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedDatasource']) {
      this.handleDatasourceChanges()
    }
    if (changes['fileToUpload']) {
    this.handleFileChanges();
    }
  }

  handleDatasourceChanges() {
    this.clearSelectOptions();
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
      this.filterButtonClick.emit("");
  }

  //populate the select elements for year/make
  populateDBOptions() {
    this.clearSelectOptions();
    this.populateMakeOptions();
    this.populateYearOptions();
  }

  populateMakeOptions() {
    if (this.selectedDatasource == 'csv') {
      if (this.fileToUpload) {
        const formData: FormData = new FormData();
        formData.append('file', this.fileToUpload!, this.fileToUpload!.name);
        this.csvData.getCSVDBMakeOptions(formData).subscribe({
          next: (response: any) => {
            this.makeOptions = response.makeOptions;
            this.messageService.sendSuccess({message:"File Successfully Parsed"});
          },
          error: (error: any) => {
            this.fileToUpload = null;
            this.messageService.sendError("Error while parsing CSV file, check for proper format")
            console.log('An error occurred:', error);
          },
          complete: () => {
            console.log('Request completed');
          }
        })
      } else {
        this.messageService.sendError('Error: no file selected');
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
        this.csvData.getCSVYearOptions(formData).subscribe(
          {
            next: (response: any) => {
              this.yearOptions = response.yearOptions;
              this.messageService.sendSuccess({message:"File Successfully Parsed"});
            },
            error: (error: any) => {
              this.fileToUpload = null;
              this.messageService.sendError("Error while parsing CSV file, check for proper format")
              console.log('An error occurred:', error);
            },
            complete: () => {
              console.log('Request completed');
            }
          })
      } else {
        this.messageService.sendError('Error: no file selected') ;
      }

    }
    if (this.selectedDatasource == 'h2') {
      this.dbData.getDBYearOptions().subscribe((data) => {
        this.yearOptions = data.yearOptions;
      })
    }
  }

  clearSelectOptions() {
    this.makeOptions = [];
    this.yearOptions = [];
  }

  clearChoices() {
    this.selectedMake = "";
    this.selectedYear = "";
    this.priceFilter = 0;
  }

}
