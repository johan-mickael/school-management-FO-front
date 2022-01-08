import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ResourceService } from '../../../../services/resource.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorService } from '../../../../services/error.service';
import { SchoolYear, Student } from '../../../../services/interfaces';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit, OnChanges {

  constructor(
    private resourceService: ResourceService,
    private spinnerService: NgxSpinnerService,
    private errorService: ErrorService
  ) { }

  @Input() subclassId: number;
  selectedSchoolYearId: number;
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

  async ngOnInit() {
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
    this.resourceService.findAll('subclasses/students/' + this.subclassId + '/' + this.selectedSchoolYearId + '/').subscribe({
      next: success,
      error: error
    });
  }

  async getSchoolYear() {
    const success = async (data: any) => {
      this.schoolYears = data as SchoolYear[];
      this.selectedSchoolYearId = this.schoolYears[0].id
    }
    const error = async (error: any) => {
      this.errorService.handleError(error, this.classSpinner);
    }
    const complete = async () => {
      this.spinnerService.hide(this.classSpinner);
      this.dataLoaded = Promise.resolve(true);
    }
    this.resourceService.findAll('schoolyears/').subscribe({
      next: success,
      error: error,
      complete: complete
    });
  }

  async fetchData() {
    await this.spinnerService.show(this.studentTableSpinner.name);
    await this.getSchoolYear();
  }

}
