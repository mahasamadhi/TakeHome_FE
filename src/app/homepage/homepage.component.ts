import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import {CarService} from "../services/car.service";


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {
  fileInputEl: HTMLInputElement | null = null;
  yearControl = new FormControl('');
  fileToUpload: File | null;
  errorMessage: string | null = null;
  uploadSuccess: boolean | null = null;
  deleteSuccess: boolean | null = null;

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
      // Code for disabling filter sections
  isGroupSortActive: boolean = true;  // 'Sort & Order' is active by default
  isFilterActive: boolean = false;  // 'Filter' is not active by default

  //choosing datasource

  selectedDatasource: string = 'csv';

  queryParams: any = {};

  constructor(private http: HttpClient,private carService: CarService) {
    this.fileToUpload = null;
  }

  ngOnInit(): void {
    this.fileInputEl = document.getElementById('fileInput') as HTMLInputElement;
    this.populateMakeOptions();
    this.populateYearOptions();
    }

  submitRequest() {
    if (this.isGroupSortActive) {

      if (this.selectedDatasource == 'csv') {
        switch (this.selectedGroupByOption) {
          case 'Year':
            this.csvToPdfByYear();
            break;
          case 'Make':
            this.csvToPdfByMake()
            break;
          default:
            break;
        }
      }

      if (this.selectedDatasource == 'h2') {
        switch (this.selectedGroupByOption) {
          case 'Year':
            this.carService.getAllByYearDB(this.selectedSortDirOption).subscribe(this.getObserverForPdfDownload())
            break;
          case 'Make':
            this.carService.getAllByMakeDB(this.selectedSortDirOption).subscribe(this.getObserverForPdfDownload())
            break;
          default:
            break;
        }
      }

    }
    if (this.isFilterActive) {
      this.queryParams["filterBy"] = this.selectedFilterByOption;

      switch (this.selectedFilterByOption) {
        case 'Make':
          this.carService.getCarsByMake(this.selectedMake ? this.selectedMake : '', this.selectedDatasource);
          break;
        case 'Year':
          this.carService.getCarsByYear(Number(this.selectedYear), this.selectedDatasource);
          break;
        case 'Price':

          this.carService.getAllCarsLessThan(this.priceFilter, this.selectedDatasource);
          break;
        default:
          break;
      }
    }
  }



//CSV TO PDF
  csvToPdfByYear() {
    if (this.fileToUpload) {
      this.errorMessage = null;
      const formData: FormData = new FormData();
      formData.append('file', this.fileToUpload, this.fileToUpload.name);
      this.carService.getAllByYearCSV(this.selectedSortDirOption,formData).subscribe(this.getObserverForPdfDownload())
    } else {
      this.errorMessage = 'No file selected';
    }
  }

  csvToPdfByMake() {
    if (this.fileToUpload) {
      this.errorMessage = null;
      const formData: FormData = new FormData();
      formData.append('file', this.fileToUpload, this.fileToUpload.name);
      this.carService.getAllByMakeCSV(this.selectedSortDirOption,formData).subscribe(this.getObserverForPdfDownload())
    } else {
      this.errorMessage = 'No file selected';
    }
  }

  //DATABASE
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
      this.errorMessage = 'No file selected';
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

        this.populateMakeOptions()
      }
    });

  }

  getObserverForPdfDownload() {
    return {
      next: (response: any) => {
        console.log(response);
        const blob = new Blob([response.body], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      },
      error: (error: any) => {
        console.log('An error occurred:', error);
      },
      complete: () => {
        console.log('Request completed');
      }
    }
  }

  onSortOrderButtonClick(): void {
    this.isGroupSortActive = true;
    this.isFilterActive = false;
  }

  onFilterButtonClick(): void {
    this.isGroupSortActive = false;
    this.isFilterActive = true;
  }

  populateMakeOptions() {
    this.carService.getH2MakeOptions().subscribe((data)=>{
      this.makeOptions = data.makeOptions;
    })
  }

  populateYearOptions() {
    this.carService.getH2YearOptions().subscribe((data)=>{
      this.yearOptions = data.yearOptions;
    })
  }

  handleFileInput(event: Event) {
    if (this.fileToUpload) {
      this.fileToUpload = null;
    }
    const element = event.target as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      let fileItem: File | null = fileList.item(0);
      if (fileItem) {
        this.fileToUpload = fileItem;
        this.errorMessage = null;
      } else {
        this.errorMessage = 'No file selected';
      }
    }
  }
}
