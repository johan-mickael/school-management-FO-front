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
  dataLoaded: Promise<boolean>;

  selectedSubclassId: number;

  ngOnInit(): void {
    this.subscription = this.errorService.errorMessage.subscribe(message => this.message = message);
    this.fetchData();
  }

  setSelectedSubclassesId(id: number) {
    this.selectedSubclassId = id;
  }

  async fetchData() {
    await this.spinnerService.show(this.spinner.name);
    var success = async (data: any) => {
      this.subclasses = data as Subclass[]
      this.setSelectedSubclassesId(this.subclasses[0].id);
    }
    var error = async (error: any) => {
      this.errorService.handleError(error, this.spinner.name);
    }
    await this.resourceService.findAll(this.resources[0]).subscribe({
      next: success,
      error: error
    });
    success = async (data: any) => {
      this.populateClassSelectInput(data);
    }
    error = async (error: any) => {
      this.errorService.handleError(error, this.spinner.name);
    }
    const complete = async () => {
      this.spinnerService.hide(this.spinner.name);
      this.dataLoaded = Promise.resolve(true);
    }
    await this.resourceService.findAll(this.resources[1]).subscribe({
      next: success,
      error: error,
      complete: complete
    });
  }

  async onClassChange() {
    await this.spinnerService.show(this.spinner.name);
    const success = async (data: any) => {
      this.subclasses = data as Subclass[]
      this.selectedSubclassId = this.subclasses[0].id;
    }
    const error = async (error: any) => {
      this.errorService.handleError(error, this.spinner.name);
    }
    const complete = async () => {
      this.spinnerService.hide(this.spinner.name);
    }
    this.resourceService.findOne(this.resources[0], this.selectedClass).subscribe({
      next: success,
      error: error,
      complete: complete
    });
  }

  populateClassSelectInput(data: any) {
    const classes = data as Class[];
    classes.forEach((_class) => {
      this.classes.push(_class);
    });
  }
}
