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
  yearControl = new FormControl('');
  fileToUpload: File | null;
  errorMessage: string | null = null;
  uploadSuccess: boolean | null = null;
  deleteSuccess: boolean | null = null;


  fileInputEl: HTMLInputElement | null = null;

  constructor(private http: HttpClient,private carService: CarService) {
    this.fileToUpload = null;
  }

  ngOnInit(): void {
    this.fileInputEl = document.getElementById('fileInput') as HTMLInputElement;
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
  csvToPdfByYear() {
    if (this.fileToUpload) {
      this.errorMessage = null;
      const formData: FormData = new FormData();
      formData.append('file', this.fileToUpload, this.fileToUpload.name);
      this.carService.csvToPdfByYear(formData).subscribe(this.getObserverForPdfDownload())
    } else {
      this.errorMessage = 'No file selected';
    }
  }

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
        }
      })
    } else {
      this.errorMessage = 'No file selected';
    }
  }

  csvToPdfByMake() {
    if (this.fileToUpload) {
      this.errorMessage = null;
      const formData: FormData = new FormData();
      formData.append('file', this.fileToUpload, this.fileToUpload.name);
      this.carService.csvToPdfByMake(formData).subscribe(this.getObserverForPdfDownload())
    } else {
      this.errorMessage = 'No file selected';
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
      }
    });

  }


  getAllFromDBByYear() {
    this.carService.getAllFromDBByYear().subscribe(this.getObserverForPdfDownload()); //adjust the URL if needed
  }
  getAllFromDBByMake() {
    this.carService.getAllFromDBByMake().subscribe(this.getObserverForPdfDownload()); //adjust the URL if needed
  }

  selectByYear() {
    let year: number | null = null;
    if (this.yearControl.value) {
      year = parseInt(this.yearControl.value);
    }
    if (year) {
      this.carService.getCarsByYear(year).subscribe(this.getObserverForPdfDownload())
    } else {
      console.log(("no year select"))
    }
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
}
