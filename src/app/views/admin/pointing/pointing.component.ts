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
  students: Student[];
  size: number;
  dataLoaded: Promise<boolean>;
  done: boolean | string;

  disabled: 'disabled'

  ngOnInit(): void {
    this.subscription = this.errorService.errorMessage.subscribe(message => this.message = message);
    this.spinnerService.show(this.spinner.name);
    this.fetchData();
  }

  async savePresences() {
    await this.spinnerService.show(this.spinner.name);
    const success = async (data: any) => {
      await this.spinnerService.hide(this.spinner.name);
    }
    const error = async (error: any) => {
      await this.errorService.handleError(error, this.spinner.name);
    }
    const complete = async () => {
      await this.fetchData()
    }
    this.resourceService.savePresence(this.presenceForm.value).subscribe({
      next: success,
      error: error,
      complete: complete
    });
  }

  async endPlanning() {
    await this.spinnerService.show(this.spinner.name);
    const success = async (data: any) => {
      await this.spinnerService.hide(this.spinner.name);
    }
    const error = async (error: any) => {
      await this.errorService.handleError(error, this.spinner.name);
    }
    const complete = async () => {
      await this.fetchData()
    }
    this.resourceService.endPlanning(this.presenceForm.value).subscribe({
      next: success,
      error: error,
      complete: complete
    });
  }

  async fetchData() {
    const planningId = this.activatedRoute.snapshot.params['id'];
    this.presences.clear();
    const success = async (data: any) => {
      this.data = data;
      this.planning = this.data.planning as Planning;
      this.students = this.data.students as Student[];
      this.presencesData = this.data.presences;
      this.done = (this.planning.status == 2) ? true : false;
      console.log(this.done)
      await this.generateRow(this.students, this.presencesData)

    }
    const error = async (error: any) => {
      await this.errorService.handleError(error, this.spinner.name);
    }
    const complete = async () => {
      this.dataLoaded = Promise.resolve(true);
      await this.spinnerService.hide(this.spinner.name);
    }
    this.resourceService.findOne('presences/', planningId).subscribe({
      next: success,
      error: error,
      complete: complete
    });
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

  newRow(student: Student, presence: any) {
    if (presence === undefined) {
      var formGroup = {
        planning_id: this.planning.id,
        student_id: student.id,
        is_present_class: false,
        is_present: false,
        is_late: false,
        comment: ''
      }
    } else {
      formGroup = {
        planning_id: this.planning.id,
        student_id: student.id,
        is_present_class: presence.is_present_class,
        is_present: presence.is_present,
        is_late: presence.is_late,
        comment: presence.comment
      }
    }
    return this.formBuilder.group(formGroup)
  }

  generateRow(students: Student[], presences: any) {
    for (let i = 0; i < students.length; i++) {
      this.presences.push(this.newRow(students[i], presences[i]));
    }
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
