import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { CarDataDbService } from '../services/car-data-db.service';
import {MessageService} from "../services/message.service";

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {

  @Input() selectedDatasource!: string;
  @Output() fileInputChange = new EventEmitter<File>();
  @Output() uploadToDbSuccess: EventEmitter<string> = new EventEmitter();
  @Output() showSubmitToDbButton: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('fileInput', { static: false }) fileInputEl!: ElementRef;
  private fileToUpload: File | null = null;

  successMsg: string | null = null;
  showSubmit: boolean = false;

  constructor(private carDataDbService: CarDataDbService,private messageService: MessageService) {}


  handleFileInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (!files || files.length === 0) {
      console.log('No files available');
      return
      }
    const file = files.item(0)!;
    if (file.type != 'text/csv') {
      target.value = ''
      this.messageService.sendError("Unsupported Filetype. Accepts only CSV with car details ")
      return
    }
    this.fileToUpload = file
    this.fileInputChange.emit(this.fileToUpload!);
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
    window.scrollTo(0, document.body.scrollHeight)
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
      this.messageService.sendError('Error: no file selected') ;
    }
  }

  onFileUploadSuccess() {
    this.fileToUpload = null;
    this.messageService.sendSuccess({message:"File inserted succesfully"})
    this.uploadToDbSuccess.emit();
    this.hideSubmitToDb();

    if (this.fileInputEl) {
      this.fileInputEl.nativeElement.value = '';
    }
  }


}
