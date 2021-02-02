import { Component, DebugElement, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AccountService } from 'src/app/services/auth/account.service';
import { LoginService } from 'src/app/services/login/login.service';
import { Account } from 'src/model/account.model';
import { EventService } from 'src/app/pages/entities/event/event.service';
import { HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';
import { Event } from 'src/app/pages/entities/event/event.model';
import { ClipboardService } from 'ngx-clipboard';
import { ModalController } from '@ionic/angular';
import { CreateEventPage } from './create-event/create-event.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  account: Account;
  events: Event[];

  constructor(public modalCtrl: ModalController, private _clipboardService: ClipboardService, private toastCtrl: ToastController, private eventService: EventService, public navController: NavController, private accountService: AccountService, private loginService: LoginService) {
    this.events = [];
  }

  ngOnInit() {
    this.accountService.identity().then((account) => {
      if (account === null) {
        console.log("not logged in ");
        this.goBackToHomePage();
      } else {
        this.account = account;
      }
    });
  }

  navigateToEvent(id: number) {
    this.navController.navigateForward('/event-content/' + id);
  }

  copyEventLocation(id: number) {
    this._clipboardService.copy(location.origin + '/event-content/' + id);
    this.presentToast();
  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Event Link Copied to Clipboard',
      duration: 1000,
      position: 'middle'
    });
    toast.present();
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

  participate(event: Event, $event: any) {
    if(this.isParticipant(event)){
    this.eventService.participate(event.id, this.account.login).subscribe(
      (response) => {
        console.log("Response");
        console.log(response);
        event=response.body;
      }
    );}
    else{
      this.eventService.unparticipate(event.id, this.account.login).subscribe(
        (response) => {
          console.log("Response");
          console.log(response);
        event=response.body;
        }
      );
    }
    //($event.target as HTMLButtonElement).parentElement.setAttribute('disabled', 'true');
  }

  isParticipant(event: Event) {
    for (let i = 0; i < event.participants.length; i++) {
      if (event.participants[i].login == this.account.login) {
        return true;
      }
    }
    return false;
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

  async presentModal() {
    const modal = await this.modalCtrl.create({ component: CreateEventPage });
    modal.present();
  }
}
