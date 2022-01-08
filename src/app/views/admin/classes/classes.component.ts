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
  selectedSchoolYearId: number;
  schoolYears: SchoolYear[];
  message: string = '';
  subscription: Subscription = new Subscription;
  dataLoaded: Promise<boolean>;
  selectedSubclassId: number;

  async ngOnInit() {
    this.fetchApiData()
  }

  setSelectedSubclassesId(id: number) {
    this.selectedSubclassId = id;
  }

  async fetchApiData() {
    await this.spinnerService.show(this.spinner.name);
    try {
      const res = await Promise.all([
        this.resourceService.getPromise(this.resourceService.findAll('classes/')),
        this.resourceService.getPromise(this.resourceService.findAll('subclasses/')),
        this.resourceService.getPromise(this.resourceService.findAll('schoolyears/'))
      ])
      const data = await Promise.all(res)
      this.classes = [this.classes[0], ...data[0] as Class[]]
      this.subclasses = data[1] as Subclass[]
      this.schoolYears = data[2] as SchoolYear[]
      this.selectedSchoolYearId = this.schoolYears[0].id
      this.dataLoaded = Promise.resolve(true)
      await this.spinnerService.hide(this.spinner.name)
    } catch (error) {
      this.errorService.handleError(error, this.spinner.name)
    }
  }

  async onClassChange() {
    await this.spinnerService.show(this.spinner.name)
    try {
      this.subclasses = await this.resourceService.getPromise(this.resourceService.findOne('subclasses/', this.selectedClass)) as Subclass[]
      this.spinnerService.hide(this.spinner.name)
    } catch (error) {
      this.errorService.handleError(error, this.spinner.name)
    }
  }
}
