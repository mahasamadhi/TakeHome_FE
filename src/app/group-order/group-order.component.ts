import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-group-order',
  templateUrl: './group-order.component.html',
  styleUrls: ['./group-order.component.css']
})
export class GroupOrderComponent {

  @Input() isGroupSortActive = true;
  selectedGroupByOption = 'Year';
  selectedSortDirOption = 'asc';

  @Output() selectedGroupByOptionChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() selectedSortDirOptionChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() sortButtonClick: EventEmitter<void> = new EventEmitter();

  constructor() { }

  onSortOrderButtonClick(): void {
    this.sortButtonClick.emit();
  }
}
