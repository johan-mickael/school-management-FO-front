import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ResourceService } from '../../../../services/resource.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorService } from '../../../../services/error.service';
import { SchoolYear, Student } from '../../../../services/interfaces';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit, OnChanges {

  constructor(
    private resourceService: ResourceService,
    private spinnerService: NgxSpinnerService,
    private errorService: ErrorService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  @Input() subclassId: number;
  @Input() schoolYearId: number;
  schoolYears: SchoolYear[];
  students: Student[];
  dataLoaded: Promise<boolean>;
  readonly classSpinner: string = 'classSpinner'
  readonly studentTableSpinner = {
    name: 'studentTableSpinner',
    type: 'triangle-skew-spin'
  }

  dtOptions = {
    pagingType: 'full_numbers',
    pageLength: 10,
    autoWidth: true
  }

  getRouteParams() {
    this.subclassId = this.activatedRoute.snapshot.params['subclassId'];
    this.schoolYearId = this.activatedRoute.snapshot.params['schoolYearId'];
  }

  async ngOnInit() {
    this.getRouteParams();
    this.router.events.subscribe(event => {
      if (event.constructor.name === 'NavigationStart') {
        this.getRouteParams();
      }
    });
    await this.fetchData();
    await this.spinnerService.hide(this.studentTableSpinner.name);
    this.dataLoaded = Promise.resolve(true);
  }

  async ngOnChanges(changes: SimpleChanges) {
    await this.spinnerService.show(this.studentTableSpinner.name);
    await this.getStudents();
    await this.spinnerService.hide(this.studentTableSpinner.name);
  }

  async onSchoolYearChange() {
    await this.spinnerService.show(this.studentTableSpinner.name);
    await this.getStudents();
    await this.spinnerService.hide(this.studentTableSpinner.name);
  }

  async getStudents() {
    const success = async (data: any) => {
      this.students = data as Student[];
    }
    const error = async (error: any) => {
      this.errorService.handleError(error, this.classSpinner);
    }
    this.resourceService.findAll('subclasses/students/' + this.subclassId + '/' + this.schoolYearId + '/').subscribe({
      next: success,
      error: error
    });
  }

  async fetchData() {
    await this.spinnerService.show(this.studentTableSpinner.name);
  }

}
