import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventContentPageRoutingModule } from './event-content-routing.module';

import { EventContentPage } from './event-content.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventContentPageRoutingModule
  ],
  declarations: [EventContentPage]
})
export class EventContentPageModule {}
