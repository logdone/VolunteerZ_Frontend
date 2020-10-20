import { Component, OnInit } from '@angular/core';
import { Reaction } from './reaction.model';
import { ReactionService } from './reaction.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'page-reaction-detail',
    templateUrl: 'reaction-detail.html'
})
export class ReactionDetailPage implements OnInit {
    reaction: Reaction = {};

    constructor(
        private navController: NavController,
        private reactionService: ReactionService,
        private activatedRoute: ActivatedRoute,
        private alertController: AlertController
    ) { }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((response) => {
            this.reaction = response.data;
        });
    }

    open(item: Reaction) {
        this.navController.navigateForward('/tabs/entities/reaction/' + item.id + '/edit');
    }

    async deleteModal(item: Reaction) {
        const alert = await this.alertController.create({
            header: 'Confirm the deletion?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: 'Delete',
                    handler: () => {
                        this.reactionService.delete(item.id).subscribe(() => {
                            this.navController.navigateForward('/tabs/entities/reaction');
                        });
                    }
                }
            ]
        });
        await alert.present();
    }


}
