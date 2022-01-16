import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { AdminContentComponent } from './components/admin/admin-content.component';
import { PlanningsComponent } from './components/admin/plannings/plannings.component';
import { PointingComponent } from './components/admin/pointing/pointing.component';
import { ClassesComponent } from './components/admin/classes/classes.component';
import { ErrorpageComponent } from './components/admin/layouts/errorpage/errorpage.component';
import { PlanningFormComponent } from './components/admin/plannings/planning-form/planning-form.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin', component: AdminContentComponent, children: [
      {
        path: 'plannings', component: PlanningsComponent,
        children: [
          { path: 'new', component: PlanningFormComponent }
        ]
      },
      { path: 'plannings/:id', component: PointingComponent },
      { path: 'classes', component: ClassesComponent },
    ]
  },
  { path: 'errorPage', component: ErrorpageComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
