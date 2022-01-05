import { Component, OnInit, OnDestroy } from '@angular/core';
import { ErrorService } from '../../../services/error.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-errorpage',
  templateUrl: './errorpage.component.html',
  styleUrls: ['./errorpage.component.css']
})
export class ErrorpageComponent implements OnInit, OnDestroy {

  constructor(private errorService: ErrorService) { }

  subscription: Subscription = new Subscription;
  error: any;

  ngOnInit(): void {
    this.subscription = this.errorService.errorMessage.subscribe(error => this.error = error)
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
