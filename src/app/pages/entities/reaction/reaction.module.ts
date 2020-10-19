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

import { ReactionPage } from './reaction';
import { ReactionUpdatePage } from './reaction-update';
import { Reaction, ReactionService, ReactionDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class ReactionResolve implements Resolve<Reaction> {
  constructor(private service: ReactionService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Reaction> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Reaction>) => response.ok),
        map((reaction: HttpResponse<Reaction>) => reaction.body)
      );
    }
    return of(new Reaction());
  }
}

const routes: Routes = [
  {
    path: '',
    component: ReactionPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ReactionUpdatePage,
    resolve: {
      data: ReactionResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ReactionDetailPage,
    resolve: {
      data: ReactionResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ReactionUpdatePage,
    resolve: {
      data: ReactionResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [ReactionPage, ReactionUpdatePage, ReactionDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class ReactionPageModule {}
