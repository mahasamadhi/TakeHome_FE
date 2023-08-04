import { Component } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { CsvService } from '../services/csv.service';
import { saveAs } from 'file-saver';
import {CarDataFsService} from "../services/car-data-fs.service";
import {CarDataCsvService} from "../services/car-data-csv.service";
import {CarDataDbService} from "../services/car-data-db.service";
import * as ClipboardJS from 'clipboard';

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
  successMsg: string | null = null;
  deleteSuccess: boolean | null = null;

  //to toggle submit button for adding csv to database
  showSubmitToDb: boolean = false;

  //when FS datasource, the location of the file that was downlaoded
  fileLocationOnServer: string | null = null;

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

  //RADIO BUTTON BINDING FOR FILESYSTEM REPORT

  fsOutputType: string = 'download';

  //choosing datasource
  selectedDatasource: string = 'csv';


  constructor(private http: HttpClient, private carDataDbService: CarDataDbService, private dataService: CsvService, private carDataFs: CarDataFsService, private  carDataCsv: CarDataCsvService) {
    this.fileToUpload = null;
  }

  ngOnInit(): void {
    this.fileInputEl = document.getElementById('fileInput') as HTMLInputElement;
    }

  ngAfterViewInit() {
    new ClipboardJS('#copyButton');
  }

//FUNCTIONS TO HANDLE CHILD/PARENT INTERACTIONS

  handleGroupByOptionChange(groupByOption: string): void {
    this.selectedGroupByOption = groupByOption;
  }

  handleSortDirOptionChange(sortDirOption: string): void {
    this.selectedSortDirOption = sortDirOption;
  }

  //from filter child component

  onFilterButtonClick($event: string): void {
    if ($event == "") {
      this.isGroupSortActive = false;
      this.isFilterActive = true;
    } else {
      this.displayErrorMessage($event);
    }

  }
  onShowSubmitToDb(val : boolean): void {
    this.showSubmitToDb = val;
  }

  onSelectedFilterByOptionChange(value: string) {
    this.clearFilterValues();
    this.selectedFilterByOption = value;
  }

  clearFilterValues() {
    this.priceFilter = 0
    this.selectedYear =  null;
    this.selectedMake = null;
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

  submitGroupRequest() {
    if (this.selectedDatasource == 'csv') {
      this.CSVGroupBy();
    }
    if (this.selectedDatasource == 'fs') {
      this.FsGroupBy();
    }
    //this one shows a different method of setting parameters, using the url, see method in service
    if (this.selectedDatasource == 'h2') {
      this.carDataDbService.groupByDB(this.selectedGroupByOption,this.selectedSortDirOption).subscribe(this.getObserverForPdfDownload(
        "Cars_by_" + this.selectedGroupByOption + "_sorted_" + this.selectedSortDirOption))
    }
  }

  submitFilterRequest() {

    const by = this.selectedFilterByOption;

    if (this.emptyFilterValue()) {
      this.displayErrorMessage("Select a filter by value")
    } else {

      if (this.selectedDatasource == 'h2') {
        this.chooseH2Route(by);
      }

      if (this.selectedDatasource == 'csv') {
        this.CsvGetAllBy(by)
      }
      if (this.selectedDatasource == 'fs') {
        this.displayErrorMessage("Feature not available")
      }
    }
  }

  chooseH2Route(filterBy: string): void {
    switch (filterBy) {
      case 'Make':
        this.carDataDbService.getAllByMakeDB(this.selectedMake ? this.selectedMake : '', this.filterSortDirOption).subscribe(this.getObserverForPdfDownload(
          this.selectedMake + " Cars"));
        break;
      case 'Year':
        this.carDataDbService.getAllByYearDB(Number(this.selectedYear), this.filterSortDirOption).subscribe(this.getObserverForPdfDownload(
          this.selectedYear + " Cars"));
        break;
      case 'Price':
        this.carDataDbService.getCarsLessThanDB(this.priceFilter, this.filterSortDirOption).subscribe(this.getObserverForPdfDownload(
          "Cars less than $" + this.priceFilter));
        break;
      default:
        break;
    }
  }

  emptyFilterValue() {
     return !(this.selectedMake || this.selectedYear || this.priceFilter)
  }

  fillFormData(by: string): FormData {
    let formData = new FormData();
    formData.append('file', this.fileToUpload!);
    formData.append("sort", this.filterSortDirOption)
    formData.append("filterBy", by)
    if (by == 'Make') {
      formData.append("value", this.selectedMake!)
    }
    if (by == 'Price') {
      formData.append("value", this.priceFilter.toString())
    }
    if (by == 'Year') {
      formData.append("value", this.selectedYear!)
    }
    return formData;
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
      this.carDataCsv.groupByParameterCSV(formData).subscribe(this.getObserverForPdfDownload("Cars_by_" + this.selectedGroupByOption))
    } else {
      this.displayErrorMessage('No file selected');
    }
  }

  CsvGetAllBy(by: string) {
    if (this.fileToUpload) {
      let fileName = this.getFilterByFilename(by)
      this.errorMessage = null;
      const formData = this.fillFormData(by);
      this.carDataCsv.getAllBy(formData).subscribe(this.getObserverForPdfDownload(fileName));
    } else {
      this.displayErrorMessage('No file selected');
    }
  }

  //get the pdf filename for filter by queries
  getFilterByFilename(by:string): string {
    let fileName = "";
    if (by == 'Price') {
      fileName = "Cars less than $" + this.priceFilter;
    }
    if (by == 'Make') {
      fileName = this.selectedMake + " Cars"
    }
    if (by == 'Year') {
      fileName = this.selectedYear + " Cars"
    }
    return fileName;
  }

  //file system group by
  FsGroupBy() {
      const formData: FormData = new FormData();
      formData.append('groupBy', this.selectedGroupByOption);
      formData.append('sort', this.selectedSortDirOption);
      formData.append('outputType', this.fsOutputType)

    if (this.fsOutputType == 'download') {
      this.carDataFs.groupByDownload(formData).subscribe(this.getObserverForPdfDownload("Cars_by_" + this.selectedGroupByOption))
    } else {
      this.carDataFs.groupBySaveToFs(formData).subscribe((data)=>{
        if (data.Success == 'true') {
          this.displaySuccessMessage("File saved in: " + data.OutputPath, 7000);
          this.fileLocationOnServer = data.OutputPath;
          setTimeout(()=>{
            this.fileLocationOnServer = null;
          },7000)
        }
      })
    }

  }


  //OTHER DATABASE OPERATIONS
  deleteAllFromDb() {
    this.carDataDbService.deleteAllFromDb().subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (error: any) => {
        console.log('An error occurred:', error);
      },
      complete: () => {
        this.displaySuccessMessage("All Data Deleted.")
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

    if (newDatasourceVal == 'fs') {
      this.isGroupSortActive = true;
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
    if (this.selectedDatasource == 'csv') {
      if (this.fileToUpload) {
        this.errorMessage = null;
        const formData: FormData = new FormData();
        formData.append('file', this.fileToUpload, this.fileToUpload.name);
      this.carDataCsv.getCSVDBMakeOptions(formData).subscribe((data)=>{
        this.makeOptions = data.makeOptions;
      })
    } else {
        this.displayErrorMessage('No file selected');
      }
    }

    if (this.selectedDatasource == 'h2') {
      this.carDataDbService.getDBMakeOptions().subscribe((data)=>{
        this.makeOptions = data.makeOptions;
      })
    }

  }

  populateYearOptions() {
    if (this.selectedDatasource == 'csv') {
      if (this.fileToUpload) {
        this.errorMessage = null;
        const formData: FormData = new FormData();
        formData.append('file', this.fileToUpload, this.fileToUpload.name);
        this.carDataCsv.getCSVYearOptions(formData).subscribe((data)=>{
          this.yearOptions = data.yearOptions;
        })
      } else {
        this.displayErrorMessage('No file selected');
      }

    }
    if (this.selectedDatasource == 'h2') {
      this.carDataDbService.getDBYearOptions().subscribe((data) => {
        this.yearOptions = data.yearOptions;
      })
    }
  }

  //managing disable of inputs
  onSortOrderButtonClick(): void {
    this.isGroupSortActive = true;
    this.isFilterActive = false;
    // this.fileToUpload = null;
  }

  onDbUploadSuccess(msg :string): void {
    this.displaySuccessMessage(msg)
    this.populateDBOptions();
  }

  //other
  handleFileInput(file: File) {
    this.fileToUpload = file
    this.populateDBOptions()
  }
  displayErrorMessage(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
    this.fileToUpload = null;
  }

  displaySuccessMessage(message: string, timeout?: number) {
    this.successMsg = message;
    let _timeout = 3000;
    if (timeout){
      _timeout = timeout;
    }
    setTimeout(() => {
      this.successMsg = null;
    }, _timeout);
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


// getAllByMakeCSV() {
//   if (this.fileToUpload) {
//     this.errorMessage = null;
//     const formData: FormData = new FormData();
//     formData.append('file', this.fileToUpload, this.fileToUpload.name);
//     this.carDataDbService.getAllByMakeCSV(this.selectedMake ? this.selectedMake : '',formData, this.selectedDatasource).subscribe(this.getObserverForPdfDownload(
//       this.selectedMake + " Cars"));
//   } else {
//     this.displayErrorMessage('No file selected');
//   }
// }
//
// getAllByYearCSV() {
//   if (this.fileToUpload) {
//     this.errorMessage = null;
//     const formData: FormData = new FormData();
//     formData.append('file', this.fileToUpload, this.fileToUpload.name);
//     this.carDataDbService.getAllByYearCSV(Number(this.selectedYear),formData, this.filterSortDirOption).subscribe(this.getObserverForPdfDownload(
//       this.selectedYear + " Cars"
//     ));
//   } else {
//     this.displayErrorMessage('No file selected');
//   }
// }
//
// getAllLessThanCSV() {
//   if (this.fileToUpload) {
//     this.errorMessage = null;
//     const formData: FormData = new FormData();
//     formData.append('file', this.fileToUpload, this.fileToUpload.name);
//     this.carDataDbService.getCarsLessThanCSV(this.priceFilter,formData, this.filterSortDirOption).subscribe(this.getObserverForPdfDownload(
//       "Cars < $" + this.priceFilter));
//   } else {
//     this.displayErrorMessage('No file selected');
//   }
// }



