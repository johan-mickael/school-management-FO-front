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
  schoolYearId: number;
  schoolYears: SchoolYear[];
  students: Student[];
  dataLoaded: Promise<boolean>;

  dtOptions = {
    pagingType: 'full_numbers',
    pageLength: 10,
    autoWidth: true
  }


  async ngOnInit() {
    await this.fetchApiData();
    this.dataLoaded = Promise.resolve(true);
  }

  async ngOnChanges(changes: SimpleChanges) {
    this.getStudents()
  }

  async onSchoolYearChange() {
    this.getStudents()
  }

  async getStudents() {
    await this.spinnerService.show('student-spinner');
    try {
      const data = await Promise.resolve(
        this.resourceService.getPromise(this.resourceService.findAll('subclasses/students/' + this.subclassId + '/' + this.schoolYearId + '/'))
      )
      this.students = data as Student[]
      await this.spinnerService.hide('student-spinner');
    } catch (error) {
      this.errorService.handleError(error, 'student-spinner');
    }
  }

  async fetchApiData() {
    try {
      const res = await Promise.all([
        this.resourceService.getPromise(this.resourceService.findAll('schoolyears/')),
        this.resourceService.getPromise(this.resourceService.findAll('subclasses/students/' + this.subclassId + '/' + this.schoolYearId + '/'))
      ])
      const data = await Promise.all(res);
      this.schoolYears = data[0] as SchoolYear[]
      this.schoolYearId = this.schoolYears[0].id
      this.students = data[1] as Student[]
      this.dataLoaded = Promise.resolve(true)
      await this.spinnerService.hide('student-spinner');
    } catch (error) {
      this.errorService.handleError(error, 'student-spinner');
    }
  }

}
