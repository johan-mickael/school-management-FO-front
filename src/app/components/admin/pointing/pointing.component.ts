import { Component, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { ActivatedRoute } from '@angular/router'
import { FormBuilder, FormArray } from '@angular/forms'
// @ts-ignore
import * as html2pdf from 'html2pdf.js';
import { ResourceService } from 'src/app/services/resource.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorService } from 'src/app/services/error.service';
import { ToastService } from 'src/app/services/toast.service';
import { PageUtil } from 'src/app/utils/page.util';
import { Planning } from 'src/app/services/interfaces';

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
    public pageUtil: PageUtil
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
      class: 'badge badge-secondary',
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
      this.toastService.show('Pointage étudiant', res, 'success')
      this.pageUtil.scroll('charts')
    } catch (error: any) {
      if (error.status === 403) {
        console.log(error)
        this.toastService.show('Vous êtes en mode invité.', error.error, 'error')
        await this.spinnerService.hide("pointing-spinner")
        return
      }
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
        this.toastService.show('Pointage étudiant', res, 'info')
      } catch (error: any) {
        if (error.status === 403) {
          this.toastService.show('Vous êtes en mode invité.', error.error, 'error')
          await this.spinnerService.hide("pointing-spinner")
          return
        }
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
      setTimeout(() => {
        this.presenceForm.value.presences[index].is_present = true
      }, 0)
      this.presenceForm.value.presences[index].arriving_time = this.planning.start
    } else if (values.currentTarget.value >= this.planning.end) {
      setTimeout(() => {
        this.presenceForm.value.presences[index].is_present = false
      }, 0)
      setTimeout(() => {
        this.presenceForm.value.presences[index].is_present_class = false
      }, 0)
      this.presenceForm.value.presences[index].arriving_time = null
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
    var element = document.getElementById('presence');
    const outputName = 'Presence_' + this.planning.subclass_name + '_' + this.planning.planning_date +
      '_' + this.planning.start + '-' + this.planning.end;
    await html2pdf()
      .from(element)
      .set({
        margin: [10, 5, 10, 5],
        image: {
          type: 'jpeg',
          quality: 1
        },
        jsPDF: {
          unit: 'mm',
          format: 'A4',
          orientation: 'landscape'
        },
        enableLinks: true,
        pageBreak: {
          mode: ['avoid-all']
        }
      })
      .save(outputName);
    this.toastService.show('Pointage étudiant', 'Fiche de présence téléchargé.', 'info')
  }
}
