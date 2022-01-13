import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { ResourceService } from '../../../../services/resource.service'
import { NgxSpinnerService } from 'ngx-spinner'
import { ErrorService } from '../../../../services/error.service'
import { SchoolYear, Student, Subclass } from '../../../../services/interfaces'
import { ActivatedRoute, Router } from '@angular/router'

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

  @Input() subclass: Subclass
  schoolYearId: number
  selectedSchoolyear: SchoolYear
  schoolYears: SchoolYear[]
  students: any
  dataLoaded: Promise<boolean>
  loadingCount: number = 0
  selectedStudent: any

  dtOptions = {
    pagingType: 'full_numbers',
    pageLength: 10,
    autoWidth: true
  }

  async ngOnInit() {
    await this.fetchApiData()
  }
  async ngOnChanges(changes: SimpleChanges) {
    await this.spinnerService.show('student-spinner')
    this.loadingCount++
    if (this.loadingCount == 1) return
    await this.getStudents()
    this.spinnerService.hide('student-spinner')
  }
  async onSchoolYearChange() {
    await this.spinnerService.show('student-spinner')
    this.selectedSchoolyear = this.schoolYears.filter(schoolYear => {
      return schoolYear.id == this.schoolYearId
    })[0]
    await this.getStudents()
    this.spinnerService.hide('student-spinner')
  }
  async fetchApiData() {
    await this.spinnerService.show('student-spinner')
    try {
      this.schoolYears = await Promise.resolve(
        this.resourceService.getPromise(this.resourceService.findAll('schoolyears'))
      ) as SchoolYear[]
      this.schoolYearId = this.schoolYears[0].id
      this.selectedSchoolyear = this.schoolYears.filter(schoolYear => {
        return schoolYear.id == this.schoolYearId
      })[0]
      await this.getStudents()
      this.spinnerService.hide('student-spinner')
    } catch (error) {
      this.errorService.handleError(error, 'student-spinner')
    }
  }
  async getStudents() {
    try {
      this.students = await Promise.resolve(
        this.resourceService.getPromise(this.resourceService.findAll('subclasses/students/' + this.subclass.id + '/' + this.schoolYearId))
      )
      this.selectedStudent = this.students[0]
      this.dataLoaded = Promise.resolve(true)
    } catch (error) {
      this.errorService.handleError(error, 'student-spinner')
    }
  }
}
