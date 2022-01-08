import { Component, OnInit, AfterViewInit, AfterContentInit, ViewChild, ElementRef, Inject, Input, AfterContentChecked, ViewChildren, QueryList } from '@angular/core';
import { ErrorService } from '../../../services/error.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ResourceService } from '../../../services/resource.service';
import { Subscription } from 'rxjs';
import { Planning, Student } from '../../../services/interfaces';
// @ts-ignore
import * as html2pdf from 'html2pdf.js';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormArray } from '@angular/forms';

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
  ) { }

  presenceForm = this.formBuilder.group({
    presences: this.formBuilder.array([]),
  });
  readonly spinner = {
    name: "pointing-spinner",
    type: "line-scale"
  };
  readonly status = [
    {
      text: 'en cours',
      class: 'badge badge-warning'
    },
    {
      text: 'enregistré',
      class: 'badge badge-success'
    },
    {
      text: 'terminé',
      class: 'badge badge-danger'
    }
  ]
  message: string;
  subscription: Subscription;
  data: any;
  presencesData: any;
  planning: Planning;
  students: any;
  size: number;
  dataLoaded: Promise<boolean>;
  done: boolean | string;

  ngOnInit(): void {
    this.subscription = this.errorService.errorMessage.subscribe(message => this.message = message);
    this.spinnerService.show(this.spinner.name);
    this.fetchApiData();
  }

  async savePresences() {
    try {
      await this.spinnerService.show(this.spinner.name);
      const res = await Promise.resolve(
        this.resourceService.getPromise(this.resourceService.postData('presences/save', this.presenceForm.value))
      )
      this.fetchApiData()
    } catch (error) {
      await this.errorService.handleError(error, this.spinner.name);
    }
  }

  async endPlanning() {
    if (confirm('Voulez-vous vraiment terminer le cours ?')) {
      try {
        await this.spinnerService.show(this.spinner.name);
        const res = await Promise.resolve(
          this.resourceService.getPromise(this.resourceService.postData('presences/terminate', this.presenceForm.value))
        )
        this.fetchApiData()
      } catch (error) {
        await this.errorService.handleError(error, this.spinner.name);
      }
    }
  }

  async fetchApiData() {
    const planningId = this.activatedRoute.snapshot.params['id'];
    this.presences.clear();
    try {
      const res = await Promise.resolve(
        this.resourceService.getPromise(this.resourceService.findOne('presences/', planningId))
      )
      this.planning = res.planning as Planning;
      this.students = res.students;
      this.presencesData = res.presences;
      this.done = (this.planning.status == 2) ? true : false;
      await this.generateRow(this.students, this.presencesData)
      this.dataLoaded = Promise.resolve(true);
      this.spinnerService.hide(this.spinner.name);
    } catch (error) {
      await this.errorService.handleError(error, this.spinner.name);
    }
  }

  get presences() {
    return this.presenceForm.controls['presences'] as FormArray;
  }

  onChangePresentClass(checkb: any, index: number, values: any): void {
    if (values.currentTarget.checked) {
      this.presenceForm.value.presences[index].is_present = true;
    }
  }

  onChangePresent(checka: any, checkc: any, index: number, values: any): void {
    if (!values.currentTarget.checked) {
      setTimeout(() => {
        this.presenceForm.value.presences[index].is_late = false;
      }, 0);
      setTimeout(() => {
        this.presenceForm.value.presences[index].is_present_class = false;
      }, 0);
    }
  }

  onChangeLate(checkb: any, index: number, values: any): void {
    if (values.currentTarget.checked) {
      this.presenceForm.value.presences[index].is_present = true;
    }
  }

  newRow(student: any, presence: any) {
    if (presence === undefined) {
      var formGroup = {
        planning_id: this.planning.id,
        student_id: student.student_id,
        is_present_class: false,
        is_present: false,
        is_late: false,
        comment: ''
      }
    } else {
      formGroup = {
        planning_id: this.planning.id,
        student_id: student.student_id,
        is_present_class: presence.is_present_class,
        is_present: presence.is_present,
        is_late: presence.is_late,
        comment: presence.comment
      }
    }
    return this.formBuilder.group(formGroup)
  }

  generateRow(students: any[], presences: any) {
    students.map((student, index) => {
      this.presences.push(this.newRow(student, presences[index]));
    })
    console.log(this.presenceForm.value)
  }

  makePDF() {
    var element = document.getElementById('presence');
    const outputName = 'Presence_' + this.planning.subclass_name + '_' + this.planning.planning_date +
      '_' + this.planning.start + '-' + this.planning.end;
    html2pdf()
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
  }
}
