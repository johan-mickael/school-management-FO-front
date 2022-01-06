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

  form = this.formBuilder.group({
    presences: this.formBuilder.array([])
  });
  readonly spinner = {
    name: "pointing-spinner",
    type: "line-scale"
  };
  readonly resources: string[] = ['plannings/', 'students/'];
  message: string;
  subscription: Subscription;
  data: any;
  planning: Planning;
  students: Student[];
  size: number;
  isLoading: boolean = true;

  ngOnInit(): void {
    this.subscription = this.errorService.errorMessage.subscribe(message => this.message = message);
    this.fetchData();
  }

  async fetchData() {
    await this.spinnerService.show(this.spinner.name);
    const planningId = this.activatedRoute.snapshot.params['id'];
    const success = async (data: any) => {
      this.data = data;
      this.planning = this.data.planning as Planning;
      this.students = this.data.students as Student[];
      await this.generateRow(this.students.length)
    }
    const error = async (error: any) => {
      await this.errorService.handleError(error, this.spinner.name);
    }
    const complete = async () => {
      this.isLoading = false;
      await this.spinnerService.hide(this.spinner.name);
    }
    this.resourceService.findOne(this.resources[0], planningId).subscribe({
      next: success,
      error: error,
      complete: complete
    });
  }

  get presences() {
    return this.form.controls['presences'] as FormArray;
  }

  generateRow(size: number) {
    let student = this.formBuilder.group({
      isPresentClass: '',
      isPresent: '',
      isLate: ''
    })
    for (let i = 0; i < this.students.length; i++) {
      this.presences.push(student);
    }
  }

  onChangePresentClass(checkb: any, checkc: any, values: any): void {
    if (values.currentTarget.checked) {
      checkb.checked = true
    }
  }

  onChangePresent(checka: any, checkc: any, values: any): void {
    if (!values.currentTarget.checked) {
      checka.checked = false
      checkc.checked = false
    }
  }

  onChangeLate(checkb: any, values: any): void {
    if (values.currentTarget.checked) {
      checkb.checked = true
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
