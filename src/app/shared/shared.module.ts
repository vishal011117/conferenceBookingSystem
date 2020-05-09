import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponent } from './shared.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [SharedComponent, HeaderComponent],
  imports: [
    CommonModule
  ],
  exports: [HeaderComponent],
})
export class SharedModule { }
