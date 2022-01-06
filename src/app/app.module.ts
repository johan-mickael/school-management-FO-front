import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NavComponent } from './views/layouts/nav/nav.component';
import { SideComponent } from './views/layouts/side/side.component';
import { PlanningsComponent } from './views/admin/plannings/plannings.component';
import { ClassesComponent } from './views/admin/classes/classes.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";
import { ErrorpageComponent } from './views/layouts/errorpage/errorpage.component';
import { ErrorService } from './services/error.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PointingComponent } from './views/admin/pointing/pointing.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { ConcatPipe } from './pipe/ConcatPipe';

registerLocaleData(localeFr, 'fr');

FullCalendarModule.registerPlugins([
	dayGridPlugin,
	interactionPlugin,
	listPlugin,
	timeGridPlugin
]);

@NgModule({
	declarations: [
		AppComponent,
		NavComponent,
		SideComponent,
		PlanningsComponent,
		ClassesComponent,
		ErrorpageComponent,
		PointingComponent,
    ConcatPipe
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		HttpClientModule,
		RouterModule,
		FullCalendarModule,
		ReactiveFormsModule,
    FormsModule,
		NgxSpinnerModule
	],
	providers: [ErrorService],
	bootstrap: [AppComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
