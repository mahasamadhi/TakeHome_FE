import { Component } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {CarService} from "../services/car.service";
import { CsvService } from '../services/csv.service';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-car-report',
  templateUrl: './car-report.component.html',
  styleUrls: ['./car-report.component.css']
})
export class CarReportComponent {
  //file
  fileInputEl: HTMLInputElement | null = null;
  fileToUpload: File | null;
  //messages
  errorMessage: string | null = null;
  uploadSuccess: boolean | null = null;
  deleteSuccess: boolean | null = null;

  //to toggle submit button for adding csv to database
  showSubmitToDb: boolean = false;

  //Filter Parameters
  makeOptions: string[] = [];
  yearOptions: string[] = [];
  selectedMake: string | null = null;
  selectedYear: string | null = null;
  selectedFilterByOption: string = 'Make';
  selectedGroupByOption: string = 'Year';
  priceFilter: number = 0;

  //Sort and Order Parameters
  selectedSortDirOption: string = 'asc';
  filterSortDirOption: string = 'asc';

  // for managing the status of the filter and group by sections
  isGroupSortActive: boolean = true;
  isFilterActive: boolean = false;

  //choosing datasource
  selectedDatasource: string = 'csv';


  constructor(private http: HttpClient,private carService: CarService,  private dataService: CsvService) {
    this.fileToUpload = null;
  }

  ngOnInit(): void {
    this.fileInputEl = document.getElementById('fileInput') as HTMLInputElement;
    }

  //from group & order child component

  handleGroupByOptionChange(groupByOption: string): void {
    this.selectedGroupByOption = groupByOption;
  }

  handleSortDirOptionChange(sortDirOption: string): void {
    this.selectedSortDirOption = sortDirOption;
  }

  //from filter child component

  onFilterButtonClick(): void {
    this.isGroupSortActive = false;
    this.isFilterActive = true;
  }

  onSelectedFilterByOptionChange(value: string) {
    this.selectedFilterByOption = value;
  }

  onSelectedMakeChange(value: string) {
    this.selectedMake = value;
  }

  onSelectedYearChange(value: string) {
   this.selectedYear = value;
  }

  onPriceFilterChange(value: number) {
  this.priceFilter = value;
  }

  submitRequest() {
    if (this.isGroupSortActive) {

      if (this.selectedDatasource == 'csv') {
        this.CSVGroupBy();
      }
      if (this.selectedDatasource == 'h2') {
          this.carService.groupByDB(this.selectedGroupByOption,this.selectedSortDirOption).subscribe(this.getObserverForPdfDownload(
            "Cars by - " + this.selectedGroupByOption + ", Sort - " + this.selectedSortDirOption))
      }

      if (this.selectedDatasource == 'fs') {
        this.displayErrorMessage("Feature not implemented! See word doc for explanation");
      }
    }
    if (this.isFilterActive) {

      if (this.selectedDatasource == 'h2') {

        switch (this.selectedFilterByOption) {
          case 'Make':
            this.carService.getAllByMakeDB(this.selectedMake ? this.selectedMake : '', this.filterSortDirOption).subscribe(this.getObserverForPdfDownload(
              "Cars by make - " + this.selectedMake));
            break;
          case 'Year':
            this.carService.getAllByYearDB(Number(this.selectedYear), this.filterSortDirOption).subscribe(this.getObserverForPdfDownload(
              "Cars by year - " + this.selectedYear));
            break;
          case 'Price':
            this.carService.getCarsLessThanDB(this.priceFilter, this.filterSortDirOption).subscribe(this.getObserverForPdfDownload(
              "Cars less than - $" + this.priceFilter));
            break;
          default:
            break;
        }
      }

      if (this.selectedDatasource == 'csv') {
        switch (this.selectedFilterByOption) {
          case 'Make':
            this.getAllByMakeCSV()
            break;
          case 'Year':
            this.getAllByYearCSV()
            break;
          case 'Price':
            this.getAllLessThanCSV();
            break;
          default:
            break;

        }
      }
    }
  }


//CSV TO PDF

  //FormData object follows 'ReportOptions' pojo in backend
  CSVGroupBy() {
    if (this.fileToUpload) {
      this.errorMessage = null;
      const formData: FormData = new FormData();
      formData.append('file', this.fileToUpload, this.fileToUpload.name);
      formData.append('groupBy', this.selectedGroupByOption);
      formData.append('sort', this.selectedSortDirOption);
      this.carService.groupByParameterCSV(formData).subscribe(this.getObserverForPdfDownload("CarListBy - " + this.selectedGroupByOption))
    } else {
      this.displayErrorMessage('No file selected');
    }
  }

  getAllByMakeCSV() {
    if (this.fileToUpload) {
      this.errorMessage = null;
      const formData: FormData = new FormData();
      formData.append('file', this.fileToUpload, this.fileToUpload.name);
      this.carService.getAllByMakeCSV(this.selectedMake ? this.selectedMake : '',formData, this.selectedDatasource).subscribe(this.getObserverForPdfDownload(
         this.selectedMake + "Car List"));
    } else {
      this.displayErrorMessage('No file selected');
    }
  }

  getAllByYearCSV() {
    if (this.fileToUpload) {
      this.errorMessage = null;
      const formData: FormData = new FormData();
      formData.append('file', this.fileToUpload, this.fileToUpload.name);
      this.carService.getAllByYearCSV(Number(this.selectedYear),formData, this.filterSortDirOption).subscribe(this.getObserverForPdfDownload(
        this.selectedYear + "Car List"
      ));
    } else {
      this.displayErrorMessage('No file selected');
    }
  }
  getAllLessThanCSV() {
    if (this.fileToUpload) {
      this.errorMessage = null;
      const formData: FormData = new FormData();
      formData.append('file', this.fileToUpload, this.fileToUpload.name);
      this.carService.getCarsLessThanCSV(this.priceFilter,formData, this.filterSortDirOption).subscribe(this.getObserverForPdfDownload(
        "Cars less than - $" + this.priceFilter));
    } else {
      this.displayErrorMessage('No file selected');
    }
  }

  //OTHER DATABASE OPERATIONS

  insertCSVToDb() {
    if (this.fileToUpload) {
      this.errorMessage = null;
      const formData: FormData = new FormData();
      formData.append('file', this.fileToUpload, this.fileToUpload.name);
      this.carService.insertCsvToDb(formData).subscribe({
        next: (response: any) => {
          console.log(response);
        },
        error: (error: any) => {
          console.log('An error occurred:', error);
        },
        complete: () => {
          console.log('Request completed');
          this.uploadSuccess = true;
          setTimeout(()=>{
            this.uploadSuccess = null;
          }, 3000)
          this.fileToUpload = null;
          if (this.fileInputEl) {
            this.fileInputEl.value = '';
          }

          this.populateMakeOptions()
          this.showSubmitToDb = false;
        }
      })
    } else {
      this.displayErrorMessage('No file selected');
      this.showSubmitToDb = false;
    }
  }

  deleteAllFromDb() {
    this.carService.deleteAllFromDb().subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (error: any) => {
        console.log('An error occurred:', error);
      },
      complete: () => {
        console.log('Request completed');
        this.deleteSuccess = true;
        setTimeout(() => {
          this.deleteSuccess = null;
        }, 3000);

        this.populateDBOptions()
      }
    });

  }


  //functions for filling and clearing select elements
  onSourceChange(newDatasourceVal: string) {
    if (newDatasourceVal == 'h2') {
      this.clearOptions()
      this.populateDBOptions()
      this.fileToUpload = null;
    }
    if (newDatasourceVal == 'csv') {
      this.clearOptions()
      this.fileToUpload = null;
    }
  }
  clearOptions() {
    this.makeOptions = [];
    this.yearOptions = [];
  }
  populateDBOptions() {
    this.populateMakeOptions();
    this.populateYearOptions();
  }
  populateMakeOptions() {
    this.carService.getDBMakeOptions().subscribe((data)=>{
      this.makeOptions = data.makeOptions;
    })
  }

  populateYearOptions() {
    this.carService.getDBYearOptions().subscribe((data)=>{
      this.yearOptions = data.yearOptions;
    })
  }

  //managing disable of inputs
  onSortOrderButtonClick(): void {
    this.isGroupSortActive = true;
    this.isFilterActive = false;
    // this.fileToUpload = null;
  }

  //other
  handleFileInput(event: Event) {
    const element = event.target as HTMLInputElement;
    let fileList: FileList | null = element.files;

    //resets file when uploading another afterwards
    if (this.fileToUpload) {
      this.fileToUpload = null;
    }

    if (fileList) {
      let fileItem: File | null = fileList.item(0);
      if (fileItem) {
        this.fileToUpload = fileItem;
        this.errorMessage = null;
        this.dataService.parseFile(fileItem, (result) => {
          console.log('Parsed: ', result);
          const options = this.dataService.extractOptions(result.data);
          this.makeOptions = options.makeOptions;
          this.yearOptions = options.yearOptions;
        });
      } else {
        this.displayErrorMessage('No file selected');
      }
    }
  }
  displayErrorMessage(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
    this.fileToUpload = null;
  }

  getObserverForPdfDownload(reportType: string) {
    return {
      next: (response: any) => {
        const Filename = reportType

        // Create a new Blob from the response body
        const blob = new Blob([response.body], { type: 'application/pdf' });

        // Save the file using with filename
        saveAs(blob, Filename);
      },
      error: (error: any) => {
        console.log('An error occurred:', error);
      },
      complete: () => {
        console.log('Request completed');
      }
    }
  }
}



