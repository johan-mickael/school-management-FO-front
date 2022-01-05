import { Component, OnInit, SimpleChanges } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ResourceService } from '../../../services/resource.service';
import { ErrorService } from '../../../services/error.service';
import { Subclass, Class } from '../../../services/interfaces';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css']
})
export class ClassesComponent implements OnInit {

  constructor(
    private resourceService: ResourceService,
    private spinnerService: NgxSpinnerService,
    private errorService: ErrorService
  ) { }

  readonly spinner = {
    name: "class-spinner",
    type: "square-jelly-box"
  };
  readonly resources: string[] = ['subclasses/', 'classes/'];

  selectedClass: number = 0;
  classes: Class[] = [
    {
      id: 0,
      name: 'Toutes',
      description: 'toutes les classes'
    }
  ];
  subclasses: Subclass[] = [];

  message: string = '';
  subscription: Subscription = new Subscription;

  isLoading: boolean = true;

  ngOnInit(): void {
    this.subscription = this.errorService.errorMessage.subscribe(message => this.message = message);
    this.fetchData();
  }

  fetchData() {
    this.spinnerService.show(this.spinner.name);
    this.resourceService.findAll(this.resources[0]).subscribe(data => {
      this.subclasses = data as Subclass[]
    }, (error) => {
      this.errorService.handleError(error, this.spinner.name);
    });
    this.resourceService.findAll(this.resources[1]).subscribe(data => {
      this.populateClassSelectInput(data);
    }, (error) => {
      this.errorService.handleError(error, this.spinner.name);
    }, () => {
      this.spinnerService.hide(this.spinner.name);
      this.isLoading = false;
    })
  }

  onClassChange(changes: SimpleChanges): void {
    this.spinnerService.show(this.spinner.name);
    this.resourceService.findOne(this.resources[0], this.selectedClass).subscribe(data => {
      this.subclasses = data as Subclass[]
      this.spinnerService.hide(this.spinner.name);
    }, (error) => {
      this.errorService.handleError(error, this.spinner.name);
    });
  }

  populateClassSelectInput(data: any) {
    const classes = data as Class[];
    classes.forEach((_class) => {
      this.classes.push(_class);
    });
  }
}
