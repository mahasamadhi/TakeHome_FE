import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent {

  @Input() isGroupActive = true;
  selectedGroupByOption = 'Year';
  selectedSortDirOption = 'asc';

  @Output() selectedGroupByOptionChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() selectedSortDirOptionChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() groupButtonClick: EventEmitter<string | null> = new EventEmitter();

  constructor() { }

  onGroupButtonClick(): void {
    this.groupButtonClick.emit();
  }
}
