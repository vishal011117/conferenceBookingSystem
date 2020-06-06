import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { ViewComponent } from './view/view.component';
import { TrackComponent } from './track/track.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [{
  path: 'main',
  component: MainComponent,
  children: [{
    path:'list',
    component: ListComponent
  }, {
    path: 'view/:id',
    component: ViewComponent
  }, {
    path: 'tracker',
    component: TrackComponent,
  }, {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
