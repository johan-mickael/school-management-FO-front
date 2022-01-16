import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData, DatePipe } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { ToastrModule } from 'ngx-toastr';
import { NavComponent } from './layouts/nav/nav.component';
import { SideComponent } from './layouts/side/side.component';
import { PlanningsComponent } from './plannings/plannings.component';
import { ClassesComponent } from './classes/classes.component';
import { ErrorpageComponent } from './layouts/errorpage/errorpage.component';
import { PointingComponent } from './pointing/pointing.component';
import { StudentsComponent } from './classes/students/students.component';
import { SubclassComponent } from './classes/subclass/subclass.component';
import { PlanningChartComponent } from './pointing/planning-chart/planning-chart.component';
import { ConcatPipe } from '../../pipe/ConcatPipe';
import { HourPipe } from '../../pipe/HourPipe';
import { StudentFormComponent } from './classes/students/student-form/student-form.component';
import { AdminContentComponent } from './admin-content.component';
import { ErrorService } from '../../services/error.service';
import { PageUtils } from '../../utils/pageUtils';
import { AdminContentRoutingModule } from './admin-content-routing-module';
registerLocaleData(localeFr, 'fr');

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  interactionPlugin,
  listPlugin,
  timeGridPlugin
]);

@NgModule({
  declarations: [
    NavComponent,
    SideComponent,
    PlanningsComponent,
    ClassesComponent,
    ErrorpageComponent,
    PointingComponent,
    StudentsComponent,
    SubclassComponent,
    PlanningChartComponent,
    ConcatPipe,
    HourPipe,
    StudentFormComponent,
    AdminContentComponent,
  ],
  imports: [
    AdminContentRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    FullCalendarModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      preventDuplicates: true,
      closeButton: true,
    }),
  ],
  providers: [ErrorService, DatePipe, PageUtils],
  bootstrap: [AdminContentComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminContentModule { }
