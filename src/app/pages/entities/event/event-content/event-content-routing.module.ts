import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventContentPage } from './event-content.page';

const routes: Routes = [
  {
    path: '',
    component: EventContentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventContentPageRoutingModule {}
