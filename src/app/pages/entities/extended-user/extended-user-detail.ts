import { Component, OnInit } from '@angular/core';
import { ExtendedUser } from './extended-user.model';
import { ExtendedUserService } from './extended-user.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-extended-user-detail',
  templateUrl: 'extended-user-detail.html',
})
export class ExtendedUserDetailPage implements OnInit {
  extendedUser: ExtendedUser = {};

  constructor(
    private navController: NavController,
    private extendedUserService: ExtendedUserService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.extendedUser = response.data;
    });
  }

  open(item: ExtendedUser) {
    this.navController.navigateForward('/tabs/entities/extended-user/' + item.id + '/edit');
  }

  async deleteModal(item: ExtendedUser) {
    const alert = await this.alertController.create({
      header: 'Confirm the deletion?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: () => {
            this.extendedUserService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/extended-user');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
