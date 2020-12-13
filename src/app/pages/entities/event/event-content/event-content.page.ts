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
      console.log(this.event.participants[0].id);
    });
    this.accountService.identity().then((account) => {
      if (account === null) {
        this.goBackToHomePage();
      } else {
        this.account = account;
        console.log("this account name "+this.account.name);
      }
    });

  }

  goBack(){
    this.navController.back();
  }



  private goBackToHomePage(): void {
    this.navController.navigateBack('');
  }

  reportComment(){
    console.log("Hello");
  }
  
}
