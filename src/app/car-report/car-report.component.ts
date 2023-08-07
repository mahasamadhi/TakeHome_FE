import {Component, ViewChild} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { CsvService } from '../services/csv.service';
import { saveAs } from 'file-saver';
import {CarDataFsService} from "../services/car-data-fs.service";
import {CarDataCsvService} from "../services/car-data-csv.service";
import {CarDataDbService} from "../services/car-data-db.service";
import * as ClipboardJS from 'clipboard';
import {FilterComponent} from "../filter/filter.component";
import {MessageService} from "../services/message.service";

@Component({
  selector: 'app-car-report',
  templateUrl: './car-report.component.html',
  styleUrls: ['./car-report.component.css']
})
export class CarReportComponent {

  @ViewChild(FilterComponent) filterComponent!: FilterComponent;
  //file
  fileToUpload: File | null = null;


  //Filter Parameters
  selectedMake: string | null = null;
  selectedYear: string | null = null;
  selectedFilterByOption: string = 'Make';
  priceFilter: number = 0;


  //Group and Sort Parameters
  selectedSortDirOption: string = 'asc';
  // for managing the status of the filter and group by sections
  isGroupSortActive: boolean = true;
  isFilterActive: boolean = false;
  selectedGroupByOption: string = 'Year';


  //to toggle submit button for adding csv to database
  showSubmitToDb: boolean = false;

  //Filesystem

    //radio button binding for filesystem report
    fsOutputType: string = 'download';
    //when FS datasource, the location of the file that was downlaoded
    fileLocationOnServer: string | null = null;

  //choosing datasource
  selectedDatasource: string = 'csv';

  constructor(
    private http: HttpClient,
    private carDataDbService: CarDataDbService,
    private dataService: CsvService,
    private carDataFs: CarDataFsService,
    private  carDataCsv: CarDataCsvService,
  private messageService: MessageService ) {}

  ngAfterViewInit() {
    new ClipboardJS('#copyButton');
  }

//FUNCTIONS TO HANDLE CHILD/PARENT INTERACTIONS

  handleGroupByOptionChange(groupByOption: string): void {
    this.selectedGroupByOption = groupByOption;
  }
  handleSortDirOptionChange(sortDirOption: string): void {
    this.selectedSortDirOption = sortDirOption;
    if (this.groupByReady()) {
      this.jiggle(document.getElementById("submitGroupButton")!);
    }

  }
  handleFileInput(file: File) {
    this.fileToUpload = file;
  }
  //from filter child component


  onShowSubmitToDb(val : boolean): void {
    this.showSubmitToDb = val;
  }

  onSelectedFilterByOptionChange(value: string) {
    this.clearFilterChoices()
    this.selectedFilterByOption = value;
  }

  onSelectedMakeChange(value: string) {
    this.selectedMake = value;
    this.jiggle(document.getElementById("submitFilterButton")!);

  }

  onSelectedYearChange(value: string) {
   this.selectedYear = value;
    this.jiggle(document.getElementById("submitFilterButton")!);
  }

  onPriceFilterChange(value: number) {
  this.priceFilter = value;
  }

//STARTING POINT OF APP FLOW
  onSourceChange(newDatasourceVal: string) {
    this.clearFilterValues();
    this.selectedDatasource = newDatasourceVal;
    this.fileToUpload = null;
    if (newDatasourceVal == 'fs') {
      this.isGroupSortActive = true;
      this.isFilterActive = false;
    }
  }

//MAIN FUNCTIONALITY

  submitGroupRequest() {
    this.scrollToBottom()
    switch (this.selectedDatasource) {
      case 'csv':
        this.CSVGroupBy();
        break;

      case 'fs':
        this.FsGroupBy();
        break;

      case 'h2':
        const groupBy = this.selectedGroupByOption
        const sortDirection = this.selectedSortDirOption;
        const fileName = `Cars_by_${groupBy}_sorted_${sortDirection}`;

        this.carDataDbService.groupByDB(groupBy, sortDirection)
          .subscribe(this.getObserverForPdfDownload(fileName));
        break;

      default:
        this.messageService.sendError("Invalid data source selected");
        break;
    }
  }

  submitFilterRequest() {
    this.scrollToBottom()
    if(this.selectedDatasource == 'csv' && !this.fileToUpload) {
      this.messageService.sendError("No file selected");
    } else if (this.emptyFilterValue()) {
      this.messageService.sendError("Select a filter-by value");
      return;
    }

    switch (this.selectedDatasource) {
      case 'h2':
        this.chooseH2Route(this.selectedFilterByOption);
        break;
      case 'csv':
        this.CsvGetAllBy(this.selectedFilterByOption);
        break;
      default:
        this.messageService.sendError("Invalid data source selected");
        break;
    }
  }

  //decides which route is needed when doing a filterby query with the h2 database
  chooseH2Route(filterBy: string): void {
    const filename = this.getFilterByFilename(filterBy)
    switch (filterBy) {
      case 'Make':
        this.carDataDbService.getAllByMakeDB(this.selectedMake ? this.selectedMake : '', this.selectedSortDirOption).subscribe(this.getObserverForPdfDownload(filename));
        break;
      case 'Year':
        this.carDataDbService.getAllByYearDB(Number(this.selectedYear), this.selectedSortDirOption).subscribe(this.getObserverForPdfDownload(filename));
        break;
      case 'Price':
        this.carDataDbService.getCarsLessThanDB(this.priceFilter, this.selectedSortDirOption).subscribe(this.getObserverForPdfDownload(filename));
        break;
      default:
        break;
    }
  }

  //determine whether or not there's been a filter by value selection


//GROUP BY

  //FormData object follows 'ReportOptions' pojo in backend
  CSVGroupBy() {
    if (this.fileToUpload) {
      const formData: FormData = new FormData();
      formData.append('file', this.fileToUpload, this.fileToUpload.name);
      formData.append('groupBy', this.selectedGroupByOption);
      formData.append('sort', this.selectedSortDirOption);
      this.carDataCsv.groupByParameterCSV(formData).subscribe(
        this.getObserverForPdfDownload("Cars_by_" + this.selectedGroupByOption))
    } else {
      this.messageService.sendError("no file selected");
    }
  }

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
          this.messageService.sendSuccess({message:  "File saved in: " + data.OutputPath, timeout: 7000});
          this.fileLocationOnServer = data.OutputPath;
          setTimeout(()=>{
            this.fileLocationOnServer = null;
          },7000)
        }
      })
    }
  }
  //GET ALL BY

  CsvGetAllBy(by: string) {
    if (this.fileToUpload) {
      let fileName = this.getFilterByFilename(by)
      const formData = this.fillFormData(by);
      this.carDataCsv.getAllBy(formData).subscribe(this.getObserverForPdfDownload(fileName));
    } else {
      this.messageService.sendError('No file selected');
    }
  }

  //FormData object for the combined csv filter-by method,
  // using a parameter object instead of having seperate routes
  fillFormData(by: string): FormData {
    let formData = new FormData();
    formData.append('file', this.fileToUpload!);
    formData.append("sort", this.selectedSortDirOption)
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




  //OTHER DATABASE OPERATIONS
  deleteAllFromDb() {
    this.clearFilterValues();
    this.scrollToBottom()
    this.carDataDbService.deleteAllFromDb().subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (error: any) => {
        console.log('An error occurred:', error);
      },
      complete: () => {
        this.messageService.sendSuccess({message:"All Data Deleted."})
        this.filterComponent.populateDBOptions()
      }
    });
  }

  onDbUploadSuccess(): void {
    this.filterComponent.populateDBOptions();
  }

  // helpers and UI state


  // clears all selected and populated values within the filter component
  clearFilterValues() {
    this.filterComponent.clearSelectOptions();
    this.priceFilter = 0
    this.selectedYear =  null;
    this.selectedMake = null;
  }

  clearFilterChoices() {
    this.filterComponent.clearChoices();
    this.priceFilter = 0
    this.selectedYear =  null;
    this.selectedMake = null;
  }

  //get the pdf filename for filter-by queries
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

  emptyFilterValue(): boolean {
    return !(this.selectedMake || this.selectedYear || this.priceFilter)
  }
  groupByReady() {
    return (this.fileToUpload || this.selectedDatasource =='h2' || this.selectedDatasource == 'fs')
  }

  onFilterButtonClick(): void {
    this.isGroupSortActive = false;
    this.isFilterActive = true;
  }

  onGroupSortButtonClick(): void {
    this.isGroupSortActive = true;
    this.isFilterActive = false;
  }

  //observer object used by all flows that return a pdf to the user
  getObserverForPdfDownload(reportType: string) {
    return {
      next: (response: any) => {
        const Filename = reportType
        const blob = new Blob([response.body], { type: 'application/pdf' });
        saveAs(blob, Filename);
      },
      error: (error: any) => {
        this.fileToUpload = null;
        console.log('An error occurred:', error);
      },
      complete: () => {
        console.log('Request completed');
        this.messageService.sendSuccess({message:"Success!"});
      }
    }
  }

  //other


  jiggle(button: HTMLElement): void {
    button.classList.add('jiggle');
    setTimeout(() => {
      button.classList.remove('jiggle');
    }, 200);  // This duration should match the animation's duration
  }
  scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }

}

