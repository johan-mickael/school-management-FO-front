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
import { DOCUMENT } from '@angular/common';

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
    this.resourceService.findOne(this.resources[0], planningId).subscribe(data => {
      this.data = data;
      this.planning = this.data.planning as Planning;
      this.students = this.data.students as Student[];
    }, (error) => {
      this.errorService.handleError(error, this.spinner.name);
    }, async () => {
      this.isLoading = false;
      await this.spinnerService.hide(this.spinner.name);
      this.initCheckboxScripts();
    });
  }

  makePDF() {
    var element = document.getElementById('presence');
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
      .save('Presence_' + this.planning.subclass_name + '_' + this.planning.planning_date +
        '_' + this.planning.start + '-' + this.planning.end);
  }

  formatFullName(student: any) {
    return student.first_name + ' ' + student.last_name;
  }

  generateRow() {
    const presences = this.form.controls["presences"] as FormArray;
    presences.push(
      this.formBuilder.group({
        isPresentClass: '',
        isPresent: '',
        isLate: ''
      })
    );
  }

  initCheckboxScripts() {
    $("input:checkbox").change(function () {
      var ischecked = $(this).is(':checked');
      const id = $(this).attr("id");
      if (id != undefined) {
        const num = id.substring(1);
        if (ischecked) {
          if (id[0] == 'a') {
            $("#b" + num).prop('checked', true)
          }
          if (id[0] == 'c') {
            $("#b" + num).prop('checked', true)
          }
        }
        if (!ischecked) {
          if (id[0] == 'b') {
            $("#a" + num).prop('checked', false)
            $("#c" + num).prop('checked', false)
          }
        }
      }
    });
  }
}
