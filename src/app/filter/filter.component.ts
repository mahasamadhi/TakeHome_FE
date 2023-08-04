import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {
  @Input() isFilterActive = false;
  @Input() makeOptions: string[] = [];
  @Input() yearOptions: string[] = [];
  @Input() selectedDatasource!: string;

  @Output() filterButtonClick: EventEmitter<string> = new EventEmitter();
  @Output() selectedFilterByOptionChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() selectedMakeChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() selectedYearChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() priceFilterChange: EventEmitter<number> = new EventEmitter<number>();

  selectedFilterByOption = 'Make';
  selectedMake = "";
  selectedYear = "";
  priceFilter = 0;
  constructor() { }

  onFilterButtonClick(): void {
    if(this.selectedDatasource == 'fs') {
      this.filterButtonClick.emit("Feature Not Available");
    } else {
      this.filterButtonClick.emit("");
    }
  }
}
