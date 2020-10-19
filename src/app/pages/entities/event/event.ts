import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Event } from './event.model';
import { EventService } from './event.service';

@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage {
  events: Event[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private eventService: EventService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.events = [];
  }

  ionViewWillEnter() {
    this.loadAll();
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

  trackId(index: number, item: Event) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/entities/event/new');
  }

  edit(item: IonItemSliding, event: Event) {
    this.navController.navigateForward('/tabs/entities/event/' + event.id + '/edit');
    item.close();
  }

  async delete(event) {
    this.eventService.delete(event.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Event deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(event: Event) {
    this.navController.navigateForward('/tabs/entities/event/' + event.id + '/view');
  }
}
