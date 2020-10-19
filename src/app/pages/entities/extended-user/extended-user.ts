import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { ExtendedUser } from './extended-user.model';
import { ExtendedUserService } from './extended-user.service';

@Component({
  selector: 'page-extended-user',
  templateUrl: 'extended-user.html',
})
export class ExtendedUserPage {
  extendedUsers: ExtendedUser[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private extendedUserService: ExtendedUserService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.extendedUsers = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.extendedUserService
      .query()
      .pipe(
        filter((res: HttpResponse<ExtendedUser[]>) => res.ok),
        map((res: HttpResponse<ExtendedUser[]>) => res.body)
      )
      .subscribe(
        (response: ExtendedUser[]) => {
          this.extendedUsers = response;
          if (typeof refresher !== 'undefined') {
            setTimeout(() => {
              refresher.target.complete();
            }, 750);
          }
        },
        async (error) => {
          console.error(error);
          const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
          toast.present();
        }
      );
  }

  trackId(index: number, item: ExtendedUser) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/entities/extended-user/new');
  }

  edit(item: IonItemSliding, extendedUser: ExtendedUser) {
    this.navController.navigateForward('/tabs/entities/extended-user/' + extendedUser.id + '/edit');
    item.close();
  }

  async delete(extendedUser) {
    this.extendedUserService.delete(extendedUser.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'ExtendedUser deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(extendedUser: ExtendedUser) {
    this.navController.navigateForward('/tabs/entities/extended-user/' + extendedUser.id + '/view');
  }
}
