import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import {CarService} from "../services/car.service";
import * as Papa from 'papaparse';

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
  filterSortDirOption: string = 'asc';
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
            this.carService.groupByYearDB(this.selectedSortDirOption).subscribe(this.getObserverForPdfDownload())
            break;
          case 'Make':
            this.carService.groupByMakeDB(this.selectedSortDirOption).subscribe(this.getObserverForPdfDownload())
            break;
          default:
            break;
        }
      }

    }
    if (this.isFilterActive) {

      if (this.selectedDatasource == 'h2') {

        switch (this.selectedFilterByOption) {
          case 'Make':
            this.carService.getAllByMakeDB(this.selectedMake ? this.selectedMake : '', this.filterSortDirOption).subscribe(this.getObserverForPdfDownload());
            break;
          case 'Year':
            this.carService.getAllByYearDB(Number(this.selectedYear), this.filterSortDirOption).subscribe(this.getObserverForPdfDownload());
            break;
          case 'Price':
            this.carService.getCarsLessThanDB(this.priceFilter, this.filterSortDirOption).subscribe(this.getObserverForPdfDownload());
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

// ...

  // handleFileInput(event) {
  //   const file = event.target.files[0];
  //   Papa.parse(file, {
  //     header: true,
  //     complete: (result) => {
  //       console.log('Parsed: ', result);
  //       this.extractOptions(result.data);
  //     }
  //   });
  // }

  extractOptions(data: any[]) {
    this.makeOptions = [];
    this.yearOptions = [];
    this.makeOptions = [...new Set(data.map(item => item.make))];
    this.yearOptions = [...new Set(data.map(item => item.year))];
  }



//CSV TO PDF
  csvToPdfByYear() {
    if (this.fileToUpload) {
      this.errorMessage = null;
      const formData: FormData = new FormData();
      formData.append('file', this.fileToUpload, this.fileToUpload.name);
      this.carService.groupByYearCSV(this.selectedSortDirOption,formData).subscribe(this.getObserverForPdfDownload())
    } else {
      this.errorMessage = 'No file selected';
    }
  }

  csvToPdfByMake() {
    if (this.fileToUpload) {
      this.errorMessage = null;
      const formData: FormData = new FormData();
      formData.append('file', this.fileToUpload, this.fileToUpload.name);
      this.carService.groupByMakeCSV(this.selectedSortDirOption,formData).subscribe(this.getObserverForPdfDownload())
    } else {
      this.errorMessage = 'No file selected';
    }
  }

  getAllByMakeCSV() {
    if (this.fileToUpload) {
      this.errorMessage = null;
      const formData: FormData = new FormData();
      formData.append('file', this.fileToUpload, this.fileToUpload.name);
      this.carService.getAllByMakeCSV(this.selectedMake ? this.selectedMake : '',formData, this.selectedDatasource).subscribe(this.getObserverForPdfDownload());
    } else {
      this.errorMessage = 'No file selected';
    }
  }

  getAllByYearCSV() {
    if (this.fileToUpload) {
      this.errorMessage = null;
      const formData: FormData = new FormData();
      formData.append('file', this.fileToUpload, this.fileToUpload.name);
      this.carService.getAllByYearCSV(Number(this.selectedYear),formData, this.filterSortDirOption).subscribe(this.getObserverForPdfDownload());
    } else {
      this.errorMessage = 'No file selected';
    }
  }
  getAllLessThanCSV() {
    if (this.fileToUpload) {
      this.errorMessage = null;
      const formData: FormData = new FormData();
      formData.append('file', this.fileToUpload, this.fileToUpload.name);
      this.carService.getCarsLessThanCSV(this.priceFilter,formData, this.filterSortDirOption).subscribe(this.getObserverForPdfDownload());
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

        this.populateDBOptions()
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
    // this.fileToUpload = null;
  }

  onFilterButtonClick(): void {
    this.isGroupSortActive = false;
    this.isFilterActive = true;
  }

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
          Papa.parse(fileItem, {
            header: true,
            complete: (result) => {
              console.log('Parsed: ', result);
              this.extractOptions(result.data);
            }
          })
      } else {
        this.errorMessage = 'No file selected';
      }
    }


  }
}
