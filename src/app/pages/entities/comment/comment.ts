import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Comment } from './comment.model';
import { CommentService } from './comment.service';

@Component({
  selector: 'page-comment',
  templateUrl: 'comment.html',
})
export class CommentPage {
  comments: Comment[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private commentService: CommentService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.comments = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.commentService
      .query()
      .pipe(
        filter((res: HttpResponse<Comment[]>) => res.ok),
        map((res: HttpResponse<Comment[]>) => res.body)
      )
      .subscribe(
        (response: Comment[]) => {
          this.comments = response;
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

  trackId(index: number, item: Comment) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/entities/comment/new');
  }

  edit(item: IonItemSliding, comment: Comment) {
    this.navController.navigateForward('/tabs/entities/comment/' + comment.id + '/edit');
    item.close();
  }

  async delete(comment) {
    this.commentService.delete(comment.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Comment deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(comment: Comment) {
    this.navController.navigateForward('/tabs/entities/comment/' + comment.id + '/view');
  }
}
