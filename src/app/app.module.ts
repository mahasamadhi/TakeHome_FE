import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import {FormsModule} from "@angular/forms";
import { GroupOrderComponent } from './group-order/group-order.component';
import { FilterComponent } from './filter/filter.component';
import {CarReportComponent} from "./car-report/car-report.component";
import { FileUploadComponent } from './file-upload/file-upload.component';
import { ReportFormComponent } from './report-form/report-form.component';

@NgModule({
  declarations: [
    AppComponent,
    CarReportComponent,
    GroupOrderComponent,
    FilterComponent,
    CarReportComponent,
    FileUploadComponent,
    ReportFormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
