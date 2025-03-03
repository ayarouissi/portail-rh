import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdvanceRequestComponent } from './requests/advance-request/advance-request.component';
import { AdminDocRequestComponent } from './requests/admin-doc-request/admin-doc-request.component';
import { LoanRequestComponent} from './requests/loan-request/loan-request.component'
import { RequestsComponent } from './home/requests/requests.component';

const routes: Routes = [
  { path: 'requests/loan', component: LoanRequestComponent },
  { path: 'requests/advance', component: AdvanceRequestComponent },
  { path: 'requests/document', component: AdminDocRequestComponent },
  
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

  

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
