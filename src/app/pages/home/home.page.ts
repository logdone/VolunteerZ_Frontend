import { Component, DebugElement, OnInit } from '@angular/core';
import { NavController,ToastController } from '@ionic/angular';
import { AccountService } from 'src/app/services/auth/account.service';
import { LoginService } from 'src/app/services/login/login.service';
import { Account } from 'src/model/account.model';
import { EventService } from 'src/app/pages/entities/event/event.service';
import { HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';
import { Event } from 'src/app/pages/entities/event/event.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  account: Account;
  events: Event[];

  constructor(private toastCtrl: ToastController,private eventService: EventService,public navController: NavController, private accountService: AccountService, private loginService: LoginService) {
    this.events = [];
  }

  ngOnInit() {
    this.accountService.identity().then((account) => {
              console.log("not logged in ");

      if (account === null) {
        console.log("not logged in ");
        this.goBackToHomePage();
      } else {
        this.account = account;
        console.log(account);
      }
    });
  }

  navigateToEvent(id:number){
    this.navController.navigateForward('/event-content/'+id);
  }

  isAuthenticated() {
    return this.accountService.isAuthenticated();
  }

  logout() {
    this.loginService.logout();
    this.goBackToHomePage();
  }

  private goBackToHomePage(): void {
    this.navController.navigateBack('');
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  participate(id : number){
    console.log("In participate");
    this.eventService.participate(id,this.account.login).subscribe(
      (response) => {
        console.log("event with id "+response.body.title);
      }


    );
  }

  async loadAll(refresher?) {
    this.eventService
      .query()
      .pipe(
        filter((res: HttpResponse<Event[]>) => res.ok),
        map((res: HttpResponse<Event[]>) => res.body)
      )
      .subscribe(
        (response: Event[]) => {
          this.events = response;
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


}
