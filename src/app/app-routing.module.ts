import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanningsComponent } from './views/admin/plannings/plannings.component';
import { ClassesComponent } from './views/admin/classes/classes.component';
import { ErrorpageComponent } from './views/layouts/errorpage/errorpage.component';
import { PointingComponent } from './views/admin/pointing/pointing.component';

const routes: Routes = [
  { path: '', redirectTo: 'plannings', pathMatch: 'full' },
  { path: 'plannings', component: PlanningsComponent },
  { path: 'plannings/:id', component: PointingComponent },
  { path: 'classes', component: ClassesComponent },
  { path: 'errorPage', component: ErrorpageComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
