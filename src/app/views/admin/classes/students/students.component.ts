import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ResourceService } from '../../../../services/resource.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorService } from '../../../../services/error.service';
import { SchoolYear, Student, Subclass } from '../../../../services/interfaces';
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

  @Input() subclass: Subclass;
  schoolYearId: number;
  selectedSchoolyear: SchoolYear;
  schoolYears: SchoolYear[];
  students: any;
  dataLoaded: Promise<boolean>;
  loadingCount: number = 0

  dtOptions = {
    pagingType: 'full_numbers',
    pageLength: 10,
    autoWidth: true
  }

  async ngOnInit() {
    await this.fetchApiData();
  }

  async ngOnChanges(changes: SimpleChanges) {
    this.loadingCount ++
    if (this.loadingCount == 1) return;
    this.getStudents()
  }

  async onSchoolYearChange() {
    this.selectedSchoolyear = this.schoolYears.filter(schoolYear => {
      return schoolYear.id == this.schoolYearId
    })[0]
    this.getStudents()
  }

  async getStudents() {
    await this.spinnerService.show('student-spinner');
    try {
      const data = await Promise.resolve(
        this.resourceService.getPromise(this.resourceService.findAll('subclasses/students/' + this.subclass.id + '/' + this.schoolYearId))
      )
      this.students = data as Student[]
      this.dataLoaded = Promise.resolve(true)
      await this.spinnerService.hide('student-spinner');
    } catch (error) {
      this.errorService.handleError(error, 'student-spinner');
    }
  }

  async fetchApiData() {
    await this.spinnerService.show('student-spinner');
    try {
      this.schoolYears = await Promise.resolve(
        this.resourceService.getPromise(this.resourceService.findAll('schoolyears'))
      ) as SchoolYear[]
      this.schoolYearId = this.schoolYears[0].id
      this.selectedSchoolyear = this.schoolYears.filter(schoolYear => {
        return schoolYear.id == this.schoolYearId
      })[0]
      this.students = await Promise.resolve(
        this.resourceService.getPromise(this.resourceService.findAll('subclasses/students/' + this.subclass.id + '/' + this.schoolYearId))
      )
      this.dataLoaded = Promise.resolve(true)
      this.spinnerService.hide('student-spinner');
    } catch (error) {
      this.errorService.handleError(error, 'student-spinner');
    }
  }

}
