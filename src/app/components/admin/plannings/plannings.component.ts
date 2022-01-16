import { Component, OnDestroy, OnInit, SimpleChanges } from '@angular/core'
import { CalendarOptions } from '@fullcalendar/angular'
import frLocale from '@fullcalendar/core/locales/fr'
import { ResourceService } from '../../../services/resource.service'
import { Subclass, PlanningCalendar, SchoolYear } from '../../../services/interfaces';
import { NgxSpinnerService } from "ngx-spinner"
import { ErrorService } from '../../../services/error.service'
import { Subscription } from 'rxjs'
import { Router } from '@angular/router'

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
  }
  readonly facetofaceColor = '#493fb5'
  readonly remoteColor = '#f35304'

  selectedClass: number = 0
  subclasses: Subclass[] = [
    {
      id: 0,
      name: 'Toutes les classes',
      class_id: 0,
      description: '',
      class_name: '',
      class_description: ''
    }]
  schoolyearId: number;
  schoolYears: SchoolYear[];

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
    eventClick: (el) => this.router.navigate(['admin/plannings', el.event.extendedProps['planningId']])
  }

  message: string = ''
  subscription: Subscription = new Subscription
  dataLoaded: Promise<boolean>

  ngOnInit(): void {
    this.subscription = this.errorService.errorMessage.subscribe(message => this.message = message)
    this.fetchApiData()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  async onSelectInputChange() {
    await this.spinnerService.show(this.spinner.name)
    try {
      const res = await Promise.resolve(
        this.resourceService.getPromise(this.resourceService.findByMultipleId('plannings/filter', this.schoolyearId, this.selectedClass))
      ) as PlanningCalendar[]
      this.setCalendarEvents(res)
      if (this.selectedClass != 0) {
        this.calendarOptions.initialView = 'dayGridMonth'
        this.calendarOptions.headerToolbar = this.headerToolbarForOneClass
      } else {
        this.calendarOptions.initialView = 'dayGridWeek'
        this.calendarOptions.headerToolbar = this.headerToolbarForAllClasses
      }
      this.spinnerService.hide(this.spinner.name)
    } catch (error) {
      this.errorService.handleError(error, this.spinner.name)
    }
  }

  async fetchApiData() {
    this.spinnerService.show(this.spinner.name)
    try {
      const data = await Promise.all([
        this.resourceService.getPromise(this.resourceService.findAll('subclasses')),
        this.resourceService.getPromise(this.resourceService.findAll('schoolyears')),
      ])
      this.subclasses = [this.subclasses[0], ...data[0] as Subclass[]]
      this.schoolYears = data[1] as SchoolYear[]
      this.schoolyearId = this.schoolYears[0].id
      const planningData = await Promise.resolve(
        this.resourceService.getPromise(this.resourceService.findOne('plannings', this.schoolyearId))
      )
      this.setCalendarEvents(planningData)
      this.dataLoaded = Promise.resolve(true)
      this.spinnerService.hide(this.spinner.name)
    } catch (error) {
      this.errorService.handleError(error, this.spinner.name)
    }
  }

  setCalendarEvents(data: any) {
    const plannings = data as PlanningCalendar[]
    var i = 0
    plannings.forEach((item) => {
      plannings[i].className = "event-hover"
      if (item.isRemote) {
        plannings[i].backgroundColor = this.remoteColor
        plannings[i].borderColor = this.remoteColor
      } else {
        plannings[i].backgroundColor = this.facetofaceColor
        plannings[i].borderColor = this.facetofaceColor
      }
      i++
    })
    this.calendarOptions.events = plannings
  }
}
