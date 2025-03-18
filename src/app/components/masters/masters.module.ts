import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MastersRoutingModule } from './masters-routing.module';
import { BrandlogoComponent } from './brandlogo/brandlogo.component';
import { ColorComponent } from './color/color.component';
import { SizeComponent } from './size/size.component';
import { TagComponent } from './tag/tag.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BrandlogoComponent,
    ColorComponent,
    SizeComponent,
    TagComponent
  ],
  imports: [
    CommonModule,
    MastersRoutingModule,
    ReactiveFormsModule
  ]
})
export class MastersModule { }
