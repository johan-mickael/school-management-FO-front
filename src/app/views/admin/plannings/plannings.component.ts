import { Component, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import frLocale from '@fullcalendar/core/locales/fr';
import { ResourceService } from '../../../services/resource.service';
import { Subclass, PlanningCalendar } from '../../../services/interfaces';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorService } from '../../../services/error.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plannings',
  templateUrl: './plannings.component.html',
  styleUrls: ['./plannings.component.css']
})
export class PlanningsComponent implements OnInit, OnDestroy {

  constructor(
    private resourceService: ResourceService,
    private spinnerService: NgxSpinnerService,
    private errorService: ErrorService,
    private router: Router
  ) { }


  readonly spinner = {
    name: "planning-spinner",
    type: "ball-grid-pulse"
  };
  readonly resources: string[] = ['plannings/', 'subclasses/', 'plannings/filter/'];
  readonly facetofaceColor = '#493fb5';
  readonly remoteColor = '#f35304';

  selectedClass: number = 0;
  classes: Subclass[] = [
    {
      id: 0,
      name: 'Toutes les classes',
      class_id: 0,
      description: '',
      class_name: '',
      class_description: ''
    }];

  headerToolbarForAllClasses: {} = {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,listWeek,listDay'
  }
  headerToolbarForOneClass: {} = {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,listWeek,timeGridDay'
  }

  calendarOptions: CalendarOptions = {
    initialView: 'listWeek',
    locales: [frLocale],
    headerToolbar: this.headerToolbarForAllClasses,
    views: {
      dayGridMonth: {
        buttonText: 'Mois'
      },
      listWeek: {
        buttonText: 'Semaine'
      },
      listDay: {
        buttonText: 'Jour'
      }
    },
    slotMinTime: '08:00',
    slotMaxTime: '20:00',
    themeSystem: 'Pulse',
    navLinks: true,
    editable: false,
    dayMaxEvents: true,
    droppable: false,
    height: '88vh',
    eventClick: (el) => this.router.navigate(['plannings', el.event.extendedProps['planningId']])
  }

  message: string = '';
  subscription: Subscription = new Subscription;

  isLoading: boolean = true;

  ngOnInit(): void {
    this.subscription = this.errorService.errorMessage.subscribe(message => this.message = message);
    this.fetchData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onClassChange(changes: SimpleChanges): void {
    this.spinnerService.show(this.spinner.name);
    this.resourceService.findOne(this.resources[2], this.selectedClass).subscribe(data => {
      this.setCalendarEvents(data);
      if (this.selectedClass != 0) {
        this.calendarOptions.initialView = 'dayGridMonth';
        this.calendarOptions.headerToolbar = this.headerToolbarForOneClass
      } else {
        this.calendarOptions.initialView = 'dayGridWeek';
        this.calendarOptions.headerToolbar = this.headerToolbarForAllClasses
      }
    }, (error) => {
      this.errorService.handleError(error, this.spinner.name);
    }, () => {
      this.spinnerService.hide(this.spinner.name);
    });
  }

  fetchData() {
    this.spinnerService.show(this.spinner.name);
    this.resourceService.findAll(this.resources[0]).subscribe(data => {
      this.setCalendarEvents(data);
    }, (error) => {
      this.errorService.handleError(error, this.spinner.name);
    });
    this.resourceService.findAll(this.resources[1]).subscribe(data => {
      this.populateClassSelectInput(data);
    }, (error) => {
      this.errorService.handleError(error, this.spinner.name);
    }, () => {
      this.spinnerService.hide(this.spinner.name);
      this.isLoading = false;
    })
  }

  setCalendarEvents(data: any) {
    const plannings = data as PlanningCalendar[];
    var i = 0;
    plannings.forEach((item) => {
      plannings[i].className = "event-hover";
      if (item.isRemote) {
        plannings[i].backgroundColor = this.remoteColor;
        plannings[i].borderColor = this.remoteColor;
      } else {
        plannings[i].backgroundColor = this.facetofaceColor;
        plannings[i].borderColor = this.facetofaceColor;
      }
      i++;
    });
    this.calendarOptions.events = plannings;
  }

  populateClassSelectInput(data: any) {
    const classes = data as Subclass[];
    classes.forEach((_class) => {
      this.classes.push(_class);
    });
  }

}
