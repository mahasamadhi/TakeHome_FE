import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import {HomepageComponent} from "./homepage/homepage.component";
import { ReactiveFormsModule } from '@angular/forms';
import {FormsModule} from "@angular/forms";
import { GroupOrderComponent } from './group-order/group-order.component';
import { FilterComponent } from './filter/filter.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    GroupOrderComponent,
    FilterComponent
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
