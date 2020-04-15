import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListemployeeComponent } from './listemployee/listemployee.component';


const routes: Routes = [{
  path: 'list',
  component: ListemployeeComponent,
  data: { title: 'List of Employee' }
},
{
  path: '',
  redirectTo: '/list',
  pathMatch: 'full'
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
