import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private errorMessageSource = new BehaviorSubject<string | null>(null);
  private successMessageSource = new BehaviorSubject<{message: string, timeout?: number} | null>(null);

  errorMessage$ = this.errorMessageSource.asObservable();
  successMessage$ = this.successMessageSource.asObservable();

  sendError(message: string) {
    this.errorMessageSource.next(message);
  }

  sendSuccess(message: {message: string, timeout?: number}) {
    this.successMessageSource.next(message);
  }

  clearMessages() {
    this.errorMessageSource.next(null);
    this.successMessageSource.next(null);
  }
}
