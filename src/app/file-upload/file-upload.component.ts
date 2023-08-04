import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { CarDataDbService } from '../services/car-data-db.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {

  @Input() selectedDatasource!: string;

  @Output() fileInputChange = new EventEmitter<File>();

  @Output() errorMsg = new EventEmitter<string>();

  @Output() uploadToDbSuccess: EventEmitter<string> = new EventEmitter();

  @Output() showSubmitToDbButton: EventEmitter<boolean> = new EventEmitter<boolean>();


  @ViewChild('fileInput', { static: false }) fileInputEl!: ElementRef;

  private fileToUpload: File | null = null;

  successMsg: string | null = null;
  showSubmit: boolean = false;

  constructor(private carDataDbService: CarDataDbService) {}


  handleFileInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
      this.fileToUpload = files.item(0);
      if (this.fileToUpload) {
        this.fileInputChange.emit(this.fileToUpload);
      } else {
        console.log('No file selected');
      }
    } else {
      console.log('No files available');
    }
  }

  cancelUpload() {
    this.hideSubmitToDb()
  }

  showSubmitToDb() {
    this.showSubmit = true;
    this.showSubmitToDbButton.emit(true)
  }

  hideSubmitToDb() {
    this.showSubmit = false;
    this.showSubmitToDbButton.emit(false)
  }
  insertCSVToDb() {
    if (this.fileToUpload) {
       let formData: FormData = new FormData();
      formData.append('file', this.fileToUpload, this.fileToUpload.name);
      this.carDataDbService.insertCsvToDb(formData).subscribe({
        next: (response: any) => {
          console.log(response);
        },
        error: (error: any) => {
          console.log('An error occurred:', error);
        },
        complete: () => {
          this.onFileUploadSuccess();
        }
      });
    } else {
      this.errorMsg.emit('Error: no file selected') ;
    }
  }

  onFileUploadSuccess() {
    this.fileToUpload = null;
    this.uploadToDbSuccess.emit("Data uploaded successfully");
    this.hideSubmitToDb();

    if (this.fileInputEl) {
      this.fileInputEl.nativeElement.value = '';
    }
  }


}
