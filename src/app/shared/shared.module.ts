import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedComponent } from './shared.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [SharedComponent, HeaderComponent],
  imports: [
    CommonModule,
    NgbModalModule,
  ],
  exports: [HeaderComponent],
})
export class SharedModule { }
