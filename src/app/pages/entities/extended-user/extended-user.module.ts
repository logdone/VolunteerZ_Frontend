import { NgModule, Injectable } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserRouteAccessService } from '../../../services/auth/user-route-access.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

import { ExtendedUserPage } from './extended-user';
import { ExtendedUserUpdatePage } from './extended-user-update';
import { ExtendedUser, ExtendedUserService, ExtendedUserDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class ExtendedUserResolve implements Resolve<ExtendedUser> {
  constructor(private service: ExtendedUserService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ExtendedUser> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ExtendedUser>) => response.ok),
        map((extendedUser: HttpResponse<ExtendedUser>) => extendedUser.body)
      );
    }
    return of(new ExtendedUser());
  }
}

const routes: Routes = [
  {
    path: '',
    component: ExtendedUserPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ExtendedUserUpdatePage,
    resolve: {
      data: ExtendedUserResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ExtendedUserDetailPage,
    resolve: {
      data: ExtendedUserResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ExtendedUserUpdatePage,
    resolve: {
      data: ExtendedUserResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [ExtendedUserPage, ExtendedUserUpdatePage, ExtendedUserDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class ExtendedUserPageModule {}
