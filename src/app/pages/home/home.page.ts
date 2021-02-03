import { Component, OnInit } from '@angular/core';
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
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { MapComponent } from 'src/app/home/create-event/map/map.component';
import { CreateEventPage } from './create-event/create-event.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  account: Account;
  events: Event[];
  eventUrl: string;

  constructor(
    private geolocation: Geolocation,
    public modalCtrl: ModalController,
    private _clipboardService: ClipboardService,
    private toastCtrl: ToastController,
    private eventService: EventService,
    private navController: NavController,
    private accountService: AccountService,
    private loginService: LoginService,
    private socialSharing: SocialSharing
  ) {
    this.events = [];
  }

  ngOnInit() {
    this.getGeolocation();
    this.accountService.identity().then((account) => {
      if (account === null) {
        console.log('not logged in ');
        this.goBackToHomePage();
      } else {
        this.account = account;
      }
    });
  }

  public getGeolocation() {
    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
        console.log(resp.coords.latitude);
        console.log(resp.coords.longitude);
      })
      .catch((error) => {
        console.log('Error getting location', error);
      });
  }

  navigateToEvent(id: number) {
    this.navController.navigateForward('/event-content/' + id);
  }

  copyEventLocation(event: Event) {
    this.socialSharing.shareViaFacebook(event.title, event.eventImage, location.origin + '/event-content/' + event.id);
  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Event Link Copied to Clipboard',
      duration: 1000,
      position: 'middle',
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
    if (event.owner.login == this.account.login) {
      ($event.target as HTMLButtonElement).parentElement.parentElement.setAttribute('visiblilty', 'true');
    }
    if (!this.isParticipant(event)) {
      this.eventService.participate(event.id, this.account.login).subscribe((response) => {
        console.log('Participating');
        console.log(response);
        event = response.body;
        this.loadAll();
      });
    } else {
      this.eventService.unparticipate(event.id, this.account.login).subscribe((response) => {
        console.log('Unparticipating');
        console.log(response);
        event = response.body;
        this.loadAll();
      });
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
