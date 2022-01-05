import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorService } from '../../../services/error.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ResourceService } from '../../../services/resource.service';
import { Subscription } from 'rxjs';
import { Planning, Student } from '../../../services/interfaces';
// @ts-ignore
import * as html2pdf from 'html2pdf.js';

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
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

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

  fetchData() {
    this.spinnerService.show(this.spinner.name);
    const planningId = this.activatedRoute.snapshot.params['id'];
    this.resourceService.findOne(this.resources[0], planningId).subscribe(data => {
      this.data = data
      console.log(data)
      this.planning = this.data.planning as Planning
      this.students = this.data.students as Student[]
    }, (error) => {
      this.errorService.handleError(error, this.spinner.name);
    }, () => {
      this.isLoading = false;
      this.spinnerService.hide(this.spinner.name);
    });
  }
}

