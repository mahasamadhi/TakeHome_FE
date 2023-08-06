import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from '../services/message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})

export class MessageComponent implements OnInit, OnDestroy {
  errorMessage: string | null = null;
  successMessage: string | null = null;
  private subscriptions: Subscription[] = [];

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.subscriptions.push(
      this.messageService.errorMessage$.subscribe(message => {
        this.displayErrorMessage(message);
      }),
      this.messageService.successMessage$.subscribe(data => {
          if (data) {
            this.displaySuccessMessage(data.message, data.timeout);
        }
      })
    );
  }
  displayErrorMessage(message: string | null) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
  }

  displaySuccessMessage(message: string | null, timeout: number = 3000) {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = null;
    }, timeout);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}

