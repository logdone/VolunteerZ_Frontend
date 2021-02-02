import { Observable } from 'rxjs';
import { EventService } from './../event.service';
import { Comment } from './../../comment/comment.model';
import { Event } from './../event.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { AccountService } from 'src/app/services/auth/account.service';
import { CommentService } from '../../comment/comment.service';
import { Reaction } from '../../reaction/reaction.model';
import { ReactionService } from '../../reaction/reaction.service';
import { ActionSheetController } from '@ionic/angular';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { Account } from 'src/model/account.model';
import { map } from 'rxjs/internal/operators/map';
import { of } from 'rxjs/internal/observable/of';

@Component({
  selector: 'app-event-content',
  templateUrl: './event-content.page.html',
  styleUrls: ['./event-content.page.scss'],
})
export class EventContentPage implements OnInit {
  event: Event = {};
  account: Account;
  comments: Comment[];
  participants: any;
  currentComment: string;
  isReacted: boolean;
  isParticipant: boolean;
  isReported: boolean;
  reactionsCount: number;
  constructor(
    private navController: NavController,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private commentService: CommentService,
    private reactionService: ReactionService,
    private eventService: EventService,
    private toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController) { }


  ngOnInit() {
    console.log("in init");
    this.activatedRoute.data.subscribe((response) => {
      this.event = response.data;
      this.comments = this.event.comments;
      this.participants = this.event.participants;
      this.event.reactions.length;
      this.accountService.identity().then((account) => {
        if (account === null) {
          this.goBackToHomePage();
        } else {
          this.account = account;
          console.log(this.account);
          console.log("Hello im in the last step");
          this.event.reactions.forEach(e => {
            console.log("The user" + e.user.id);
            console.log("The event reactor" + account.id);
            if (e.user.login == this.account.login) {
              this.isReacted = true;
            }
          });
          this.event.participants.forEach(p => {
            if (p.login == this.account.login) {
              this.isParticipant = true;
            }
          });
          if (this.event.eventReports != null) {
            this.event.eventReports.forEach(r => {

              if (r.login == this.account.login) {
                this.isReported = true;
              }
            });
          }
          console.log(this.event.comments);
          this.event.comments.forEach(c => {
            if (c.commentReports != null) {
              c.commentReports.forEach(r => {
                if (r.login == this.account.login) {
                  c.isReported = true;
                  console.log("Hide report btn");
                }
              });
            }
          });
        }
      });

    });


  }

  goBack() {
    this.navController.back();
  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Comment Published',
      duration: 1000,
      position: 'middle'
    });
    toast.present();
  }

  private goBackToHomePage(): void {
    this.navController.navigateBack('/login');
  }

  sendComment() {
    console.log("Currenct Comment Body " + this.currentComment);
    let cComment = new Comment();
    cComment.user = this.account;
    cComment.commentBody = this.currentComment;
    cComment.event = this.event;
    this.commentService.create(cComment).subscribe((data) => {
      this.comments.push(data.body);
      this.currentComment = "";
    });
    this.presentToast();
  }


  reactToEvent() {
    let reaction = new Reaction();
    reaction.user = this.account;
    reaction.event = this.event;
    this.reactionService.create(reaction).subscribe();
  }

  async presentActionSheet() {
    let cssParticipant = "";
    let cssReport = "";

    if (this.isParticipant) {
      cssParticipant = "disabled-item"
    }
    if (this.isReported) {
      cssReport = "disabled-item"
    }

    const actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          icon: 'add',
          text: 'Participate',
          role: 'participate',
          cssClass: cssParticipant,
          handler: () => {
            this.eventService.participate(this.event.id, this.account.login).subscribe(() => window.location.reload());
          }
        },
        {
          icon: 'alert-circle-outline',
          text: 'Report',
          role: 'report',
          cssClass: cssReport,

          handler: () => {
            this.eventService.report(this.event.id, this.account.login).subscribe(() => window.location.reload());

          }
        }
      ]
    });
    (await actionSheet).present();
  }

  isAbleToReportComment(comment: Comment): boolean {
    // return this.commentService.find(id).pipe(map((data)=>{
    //   for(let r of data.body.commentReports){
    //     if(this.account.login == r.login){
    //       return true;
    //     }
    //   }
    //   return false;
    // }));

    for (let r of comment.commentReports) {
      if (this.account.login == r.login) {
        console.log("Already reported");

        return true;
      }
    }
    return false;
  }
  reportComment(id) {
    this.commentService.report(id, this.account.login).subscribe();
  }
}
