import { Component, OnInit, AfterViewInit, AfterContentInit, ViewChild, ElementRef, Inject, Input, AfterContentChecked, ViewChildren, QueryList } from '@angular/core'
import { ErrorService } from '../../../services/error.service'
import { NgxSpinnerService } from 'ngx-spinner'
import { ResourceService } from '../../../services/resource.service'
import { Subscription } from 'rxjs'
import { Planning } from '../../../services/interfaces'
import { ActivatedRoute } from '@angular/router'
import { FormBuilder, FormArray } from '@angular/forms'
import { ToastService } from '../../../services/toast.service'
import jsPDF from 'jspdf'

@Component({
  selector: 'app-pointing',
  templateUrl: './pointing.component.html',
  styleUrls: ['./pointing.component.css']
})
export class PointingComponent implements OnInit {

  constructor(
    private resourceService: ResourceService,
    private spinnerService: NgxSpinnerService,
    private errorService: ErrorService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
  ) { }

  presenceForm = this.formBuilder.group({
    presences: this.formBuilder.array([]),
  })

  readonly status = [
    {
      text: 'en cours',
      class: 'badge badge-warning',
      icon: 'fas fa-spinner'
    },
    {
      text: 'enregistré',
      class: 'badge badge-success',
      icon: 'fas fa-save'
    },
    {
      text: 'terminé',
      class: 'badge badge-danger',
      icon: 'fas fa-times'
    }
  ]
  message: string
  subscription: Subscription
  data: any
  presencesData: any
  planning: Planning
  students: any
  size: number
  dataLoaded: Promise<boolean>
  done: boolean | string
  title: string


  ngOnInit(): void {
    this.subscription = this.errorService.errorMessage.subscribe(message => this.message = message)
    this.spinnerService.show("pointing-spinner")
    this.fetchApiData()
  }

  innerHTML(selector: string) {
    return $(selector).html() as string
  }

  async savePresences() {
    try {
      await this.spinnerService.show("pointing-spinner")
      const res = await Promise.resolve(
        this.resourceService.getPromise(this.resourceService.postData('presences/save', this.presenceForm.value))
      )
      await this.fetchApiData()
      this.toastService.show('Pointage étudiant', 'Présence enregistré avec succès.', 'success')
    } catch (error) {
      await this.errorService.handleError(error, "pointing-spinner")
    }
  }

  async endPlanning() {
    if (confirm('Voulez-vous vraiment terminer le cours ?')) {
      try {
        await this.spinnerService.show("pointing-spinner")
        const res = await Promise.resolve(
          this.resourceService.getPromise(this.resourceService.postData('presences/terminate', this.presenceForm.value))
        )
        await this.fetchApiData()
        this.toastService.show('Pointage étudiant', 'Cours terminé avec succès.', 'info')
      } catch (error) {
        await this.errorService.handleError(error, "pointing-spinner")
      }
    }
  }

  async fetchApiData() {
    const planningId = this.activatedRoute.snapshot.params['id']
    this.presences.clear()
    try {
      const res = await Promise.resolve(
        this.resourceService.getPromise(this.resourceService.findOne('presences', planningId))
      )
      this.planning = res.planning as Planning
      this.students = res.students
      this.presencesData = res.presences
      this.done = (this.planning.status == 2) ? true : false
      await this.generateRow(this.students, this.presencesData)
      this.dataLoaded = Promise.resolve(true)
      this.spinnerService.hide("pointing-spinner")
    } catch (error) {
      await this.errorService.handleError(error, "pointing-spinner")
    }
  }

  get presences() {
    return this.presenceForm.controls['presences'] as FormArray
  }

  onChangePresentClass(index: number, values: any): void {
    if (values.currentTarget.checked) {
      setTimeout(() => {
        this.presenceForm.value.presences[index].is_present = true
      }, 0)
      setTimeout(() => {
        this.presenceForm.value.presences[index].arriving_time = this.planning.start
      }, 0)
    }
  }

  onChangePresent(index: number, values: any): void {
    if (!values.currentTarget.checked) {
      setTimeout(() => {
        this.presenceForm.value.presences[index].is_late = false
      }, 0)
      setTimeout(() => {
        this.presenceForm.value.presences[index].is_present_class = false
      }, 0)
      setTimeout(() => {
        this.presenceForm.value.presences[index].arriving_time = null
      }, 0)
    } else {
      this.presenceForm.value.presences[index].arriving_time = this.planning.start
    }
  }

  onChangeLate(index: number, values: any): void {
    if (this.presenceForm.value.presences[index].arriving_time == this.planning.start) {
      this.presenceForm.value.presences[index].is_late = false
    }
    if (values.currentTarget.checked) {
      this.presenceForm.value.presences[index].is_present = true
    }
  }

  onArrivingTimeChange(index: number, values: any): void {
    if (values.currentTarget.value == this.planning.start.substring(0, 5)) {
      this.presenceForm.value.presences[index].is_present = true
    }
    else if (values.currentTarget.value < this.planning.start) {
      this.presenceForm.value.presences[index].arriving_time = this.planning.start
    } else if (values.currentTarget.value > this.planning.end) {
      this.presenceForm.value.presences[index].arriving_time = this.planning.end
    }
    const is_late = this.presenceForm.value.presences[index].arriving_time > this.planning.start
    setTimeout(() => {
      this.presenceForm.value.presences[index].is_late = is_late
    }, 0)
    if (is_late) {
      setTimeout(() => {
        this.presenceForm.value.presences[index].is_present = is_late
      }, 0)
    }
  }

  newRow(student: any, presence: any) {
    if (presence === undefined) {
      var formGroup = {
        planning_id: this.planning.id,
        subject_id: this.planning.subject_id,
        student_id: student.student_id,
        is_present_class: false,
        is_present: false,
        is_late: false,
        arriving_time: null,
        comment: ''
      }
    } else {
      formGroup = {
        planning_id: this.planning.id,
        subject_id: this.planning.subject_id,
        student_id: student.student_id,
        is_present_class: presence.is_present_class,
        is_present: presence.is_present,
        is_late: presence.is_late,
        arriving_time: presence.arriving_time,
        comment: presence.comment
      }
    }
    return this.formBuilder.group(formGroup)
  }

  generateRow(students: any[], presences: any) {
    students.map((student, index) => {
      this.presences.push(this.newRow(student, presences[index]))
    })
  }

  async openPDF() {
    let PDF = new jsPDF('p', 'mm', 'a4')
    const defaultFontSize = (PDF.getFontSize() / 2) + 5
    var pageHeight = PDF.internal.pageSize.height || PDF.internal.pageSize.getHeight()
    var pageWidth = PDF.internal.pageSize.width || PDF.internal.pageSize.getWidth()
    const title = this.innerHTML("#title")
    var planningDate = this.innerHTML("#planning-date") + ' - ' + this.innerHTML("#planning-hour")
    planningDate = planningDate.charAt(0).toUpperCase() + planningDate.slice(1)
    PDF.setFontSize(defaultFontSize + 6)
    var x = pageWidth / 2
    var y = 12
    PDF.text(title, x, y, { align: 'center' })
    PDF.setFontSize(defaultFontSize - 2)
    y += 6
    PDF.text(planningDate, x, y, { align: 'center' })
    PDF.setFontSize(defaultFontSize - 2)
    y += 6
    var course = (this.innerHTML("#course-name") + ' - ' + this.innerHTML("#professor-name")).toUpperCase()
    PDF.text(course, x, y, { align: 'center' })

    PDF.save('demo.pdf')
  }
}
