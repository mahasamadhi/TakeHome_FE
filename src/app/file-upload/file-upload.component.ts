import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { CarService } from '../services/car.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {

  @Input() selectedDatasource!: string;

  @Output() fileInputChange = new EventEmitter<FileList>();

  @Output() errorMsg = new EventEmitter<string>();

  @Output() uploadToDbSuccess: EventEmitter<void> = new EventEmitter();

  @Output() showSubmitToDbButton: EventEmitter<boolean> = new EventEmitter<boolean>();


  @ViewChild('fileInput', { static: false }) fileInputEl!: ElementRef;

  private fileToUpload: File | null = null;

  successMsg: string | null = null;
  showSubmit: boolean = false;

  constructor(private carService: CarService) {}


  handleFileInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files) {
      this.fileToUpload = files.item(0);
      this.fileInputChange.emit(files);
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
          this.onFileUploadSuccess();
        }
      });
    } else {
      this.errorMsg.emit('Error: no file selected') ;
    }
  }

  onFileUploadSuccess() {
    this.showSuccessMsg("Data uploaded successfully")
    this.fileToUpload = null;
    this.uploadToDbSuccess.emit();
    this.hideSubmitToDb();

    if (this.fileInputEl) {
      this.fileInputEl.nativeElement.value = '';
    }
  }
  showSuccessMsg(msg: string) {
    this.successMsg = msg
    setTimeout(()=>{
      this.successMsg = null;
    }, 3000)
  }


}
