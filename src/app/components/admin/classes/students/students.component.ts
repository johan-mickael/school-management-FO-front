import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { NgxSpinnerService } from 'ngx-spinner'
import { ErrorService } from 'src/app/services/error.service'
import { SchoolYear, Subclass } from 'src/app/services/interfaces';
import { ResourceService } from 'src/app/services/resource.service'
import { PageUtil } from 'src/app/utils/page.util';
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
    public pageUtil: PageUtil
  ) { }

  @Input() subclass: Subclass
  schoolYearId: number
  selectedSchoolyear: SchoolYear
  schoolYears: SchoolYear[]
  students: any
  dataLoaded: Promise<boolean>
  loadingCount: number = 0
  selectedStudent: any
  studentHours: any

  dtOptions = {
    pagingType: 'full_numbers',
    pageLength: 10,
    autoWidth: true
  }

  async ngOnInit() {
    await this.fetchApiData()
  }
  async ngOnChanges(changes: SimpleChanges) {
    await this.pageUtil.scroll('students')
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
    await this.pageUtil.scroll('students')
    try {
      const data = await Promise.all([
        this.resourceService.getPromise(this.resourceService.findAll('subclasses/students/' + this.subclass.id + '/' + this.schoolYearId)),
        this.resourceService.getPromise(this.resourceService.findAll('charts/students/assisting/' + this.schoolYearId))
      ])
      this.students = data[0]
      this.selectedStudent = this.students[0]
      this.studentHours = data[1]
      this.dataLoaded = Promise.resolve(true)
    } catch (error) {
      this.errorService.handleError(error, 'student-spinner')
    }
  }

  getStudentHours(student: any) {
    return this.studentHours.filter((studentHour:any) => studentHour.student_id === student.student_id)[0]
  }

  setSelectedStudent(student:any) {
    this.selectedStudent = student
    this.pageUtil.scroll('studentForm')
  }
}
