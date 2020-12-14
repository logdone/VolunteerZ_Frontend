import { Comment } from './../../comment/comment.model';
import { EventService } from 'src/app/pages/entities/event/event.service';
import { Event } from './../event.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { AccountService } from 'src/app/services/auth/account.service';

@Component({
  selector: 'app-event-content',
  templateUrl: './event-content.page.html',
  styleUrls: ['./event-content.page.scss'],
})
export class EventContentPage implements OnInit {
  event: Event = {};
  account: Account;
  comments : Comment[];
  currentComment ="Comment is working ! ";
  constructor(    
    private navController: NavController,
    private eventService: EventService,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private alertController: AlertController) 
    { }
    

  ngOnInit() {
    console.log("in init");
    this.activatedRoute.data.subscribe((response) => {
      this.event = response.data;
      this.comments = this.event.comments;
      
    });
    this.accountService.identity().then((account) => {

      if (account === null) {
      this.goBackToHomePage();
      } else {
      this.account = account;
      console.log(this.account);
      }
});

  }

  goBack(){
    this.navController.back();
  }



  private goBackToHomePage(): void {
    this.navController.navigateBack('/login');
  }

  reportComment(){
    console.log("Currenct Comment Body "+this.currentComment);
    let cComment = new Comment();
    cComment.user = this.account;
    cComment.commentBody = this.currentComment;
    this.event.comments.push(cComment);
    this.eventService.update(this.event).subscribe((response) => {
      this.event = response.body;
      console.log("After update"+this.event.comments.length);      
    });
  }
  
}
