import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { UserRouteAccessService } from 'src/app/services/auth/user-route-access.service';
import { CreateEventPage } from './create-event/create-event.page';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, RouterModule.forChild(routes)],
  declarations: [HomePage, CreateEventPage],
})
export class HomePageModule {}
