import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { SharedModule } from '../shared/shared.module';
import { ViewComponent } from './view/view.component';
import { ListComponent } from './list/list.component';
import { TrackComponent } from './track/track.component';

@NgModule({
  declarations: [MainComponent, ViewComponent, ListComponent, TrackComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    MainRoutingModule,
  ]
})
export class MainModule { }