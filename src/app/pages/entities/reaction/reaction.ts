import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Reaction } from './reaction.model';
import { ReactionService } from './reaction.service';

@Component({
    selector: 'page-reaction',
    templateUrl: 'reaction.html'
})
export class ReactionPage {
    reactions: Reaction[];

    // todo: add pagination

    constructor(
        private navController: NavController,
        private reactionService: ReactionService,
        private toastCtrl: ToastController,
        public plt: Platform
    ) {
        this.reactions = [];
    }

    ionViewWillEnter() {
        this.loadAll();
    }

    async loadAll(refresher?) {
        this.reactionService.query().pipe(
            filter((res: HttpResponse<Reaction[]>) => res.ok),
            map((res: HttpResponse<Reaction[]>) => res.body)
        )
        .subscribe(
            (response: Reaction[]) => {
                this.reactions = response;
                if (typeof(refresher) !== 'undefined') {
                    setTimeout(() => {
                        refresher.target.complete();
                    }, 750);
                }
            },
            async (error) => {
                console.error(error);
                const toast = await this.toastCtrl.create({message: 'Failed to load data', duration: 2000, position: 'middle'});
                toast.present();
            });
    }

    trackId(index: number, item: Reaction) {
        return item.id;
    }

    new() {
        this.navController.navigateForward('/tabs/entities/reaction/new');
    }

    edit(item: IonItemSliding, reaction: Reaction) {
        this.navController.navigateForward('/tabs/entities/reaction/' + reaction.id + '/edit');
        item.close();
    }

    async delete(reaction) {
        this.reactionService.delete(reaction.id).subscribe(async () => {
            const toast = await this.toastCtrl.create(
                {message: 'Reaction deleted successfully.', duration: 3000, position: 'middle'});
            toast.present();
            this.loadAll();
        }, (error) => console.error(error));
    }

    view(reaction: Reaction) {
        this.navController.navigateForward('/tabs/entities/reaction/' + reaction.id + '/view');
    }
}
