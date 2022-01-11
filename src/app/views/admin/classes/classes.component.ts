import { Component, OnInit, SimpleChanges } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription, Observable } from 'rxjs';
import { ResourceService } from '../../../services/resource.service';
import { ErrorService } from '../../../services/error.service';
import { Subclass, Class, SchoolYear } from '../../../services/interfaces';

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

  async ngOnInit() {
    this.fetchApiData()
  }

  async fetchApiData() {
    await this.spinnerService.show(this.spinner.name);
    try {
      const data = await Promise.all([
        this.resourceService.getPromise(this.resourceService.findAll('classes/')),
        this.resourceService.getPromise(this.resourceService.findAll('subclasses/'))
      ])
      this.classes = [this.classes[0], ...data[0] as Class[]]
      this.subclasses = data[1] as Subclass[]
      this.selectedSubclassId = this.subclasses[0].id
      this.dataLoaded = Promise.resolve(true)
      await this.spinnerService.hide('class-spinner');
    } catch (error) {
      this.errorService.handleError(error, this.spinner.name)
    }
  }

  async onClassChange() {
    await this.spinnerService.show(this.spinner.name)
    try {
      this.subclasses = await this.resourceService.getPromise(this.resourceService.findOne('subclasses', this.selectedClass)) as Subclass[]
      this.selectedSubclassId = this.subclasses[0].id
      this.spinnerService.hide(this.spinner.name)
    } catch (error) {
      this.errorService.handleError(error, this.spinner.name)
    }
  }
}
