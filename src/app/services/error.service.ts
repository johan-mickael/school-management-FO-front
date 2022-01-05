import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  private messageSource = new BehaviorSubject({
    message: 'Oops Something went wrong!',
    status: '500'
  });

  errorMessage: Observable<any> = this.messageSource.asObservable();

  constructor(private router: Router, private spinnerService: NgxSpinnerService) { }

  setMessage(message: any) {
    this.messageSource.next(message);
  }

  handle(message: any) {
    this.setMessage(message);
    this.router.navigate(['/errorPage'])
  }

  handleError(message: any, spinner: string) {
    this.spinnerService.hide(spinner);
    this.handle(message);
  }
}
