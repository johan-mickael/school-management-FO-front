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

  selectedClass: number = 0;
  classes: Class[] = [
    {
      id: 0,
      name: 'Toutes les classes',
      description: ''
    }
  ];
  subclasses: Subclass[] = [];
  message: string = '';
  subscription: Subscription = new Subscription;
  dataLoaded: Promise<boolean>;
  selectedSubclass: Subclass;

  async ngOnInit() {
    await this.fetchApiData()
  }

  async fetchApiData() {
    await this.spinnerService.show("class-spinner");
    try {
      const data = await Promise.all([
        this.resourceService.getPromise(this.resourceService.findAll('classes')),
        this.resourceService.getPromise(this.resourceService.findAll('subclasses'))
      ])
      this.classes = [this.classes[0], ...data[0] as Class[]]
      this.subclasses = data[1] as Subclass[]
      this.selectedSubclass = this.subclasses[0]
      this.dataLoaded = Promise.resolve(true)
      await this.spinnerService.hide('class-spinner');
    } catch (error) {
      this.errorService.handleError(error, "class-spinner")
    }
  }

  async onClassChange() {
    await this.spinnerService.show("class-spinner")
    try {
      this.subclasses = await this.resourceService.getPromise(this.resourceService.findOne('subclasses', this.selectedClass)) as Subclass[]
      this.selectedSubclass = this.subclasses[0]
      this.spinnerService.hide("class-spinner")
    } catch (error) {
      this.errorService.handleError(error, "class-spinner")
    }
  }
}
