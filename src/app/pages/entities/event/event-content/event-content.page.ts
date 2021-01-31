import { Comment } from './../../comment/comment.model';
import { Event } from './../event.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { AccountService } from 'src/app/services/auth/account.service';
import { CommentService } from '../../comment/comment.service';
import { Reaction } from '../../reaction/reaction.model';
import { ReactionService } from '../../reaction/reaction.service';

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
  isReacted : boolean;
  reactionsCount : number;
  constructor(
    private navController: NavController,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private commentService: CommentService,
    private reactionService : ReactionService,
    private toastCtrl: ToastController) { }


  ngOnInit() {
    console.log("in init");
    this.activatedRoute.data.subscribe((response) => {
      this.event = response.data;
      this.comments = this.event.comments;
      this.participants = this.event.participants;
      this.event.reactions.length;

    });
    this.accountService.identity().then((account) => {
      if (account === null) {
        this.goBackToHomePage();
      } else {
        this.account = account;
        console.log(this.account);
        console.log("in account ");
        console.log(this.event);
        this.event.reactions.forEach(e => {if(e.user.id==this.account.id){
          console.log("reacted");
          this.isReacted == true;
        }});
      }
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

}
