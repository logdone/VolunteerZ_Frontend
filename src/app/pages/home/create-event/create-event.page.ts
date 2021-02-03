import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/services/auth/account.service';
import { User } from 'src/app/services/user/user.model';
import { EventService } from '../../entities/event';
import { Event } from '../../entities/event/event.model';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  MyLocation
} from '@ionic-native/google-maps';
import {
  Platform
} from '@ionic/angular';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.page.html',
  styleUrls: ['./create-event.page.scss'],
})
export class CreateEventPage implements OnInit {
  event: Event;
  users: User[];
  creationDate: string;
  eventDate: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;
  account: Account;
  map: GoogleMap;
  address: string;

  form = this.formBuilder.group({
    id: [],
    title: [null, [Validators.required]],
    eventDescription: [null, []],
    eventImage: [null, []],
    category: [null, []],
    creationDate: [null, [Validators.required]],
    eventDate: [null, [Validators.required]],
    maxNumberVolunteers: [null, []],
    location: [null, [Validators.required]],
  });

  constructor(
    private platform: Platform,
    protected activatedRoute: ActivatedRoute, public modalCtrl: ModalController, private formBuilder: FormBuilder, private accountService: AccountService,
    private eventService: EventService, private toastCtrl: ToastController, private navController: NavController) {
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.platform.ready();
    this.loadMap();
    this.accountService.identity().then((account) => {
      this.account = account;
    });
  }

  save() {
    this.isSaving = true;
    const event = this.createFromForm();
    this.subscribeToSaveResponse(this.eventService.create(event));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Event>>) {
    result.subscribe(
      (res: HttpResponse<Event>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Event ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/home');
    this.dismiss();
  }

  private createFromForm(): Event {
    return {
      ...new Event(),
      id: this.form.get(['id']).value,
      title: this.form.get(['title']).value,
      eventDescription: this.form.get(['eventDescription']).value,
      eventImage: this.form.get(['eventImage']).value,
      category: this.form.get(['category']).value,
      creationDate: new Date(this.form.get(['creationDate']).value),
      eventDate: new Date(this.form.get(['eventDate']).value),
      maxNumberVolunteers: this.form.get(['maxNumberVolunteers']).value,
      location: this.form.get(['location']).value,
      owner: this.account
    };
  }

  async onError(error) {
    this.isSaving = false;
    console.error(error);
    const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
    toast.present();
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }


  loadMap() {
    this.map = GoogleMaps.create('map_canvas', {
    });
    this.goToMyLocation();
  }


  goToMyLocation() {
    this.map.clear();

    // Get the location of you
    this.map.getMyLocation().then((location: MyLocation) => {
      console.log(JSON.stringify(location, null, 2));

      // Move the map camera to the location with animation
      this.map.animateCamera({
        target: location.latLng,
        zoom: 17,
        duration: 5000
      });

      //add a marker
      this.map.one(GoogleMapsEvent.MAP_READY)
        .then(() => {
          console.log('Map is ready!');

          this.map.addMarker({
            title: 'Ionic',
            icon: 'blue',
            animation: 'DROP',
            draggable: true,
            position: location.latLng
          })
            .then(marker => {
              marker.on(GoogleMapsEvent.MARKER_DRAG_END)
                .subscribe(() => {

                  let markerlatlong = marker.getPosition();
                  console.log("Dragging marker");
                  console.log(markerlatlong.lat);
                  console.log(markerlatlong.lng);
                  this.address = markerlatlong.lat + "/" + markerlatlong.lng;
                });
            });
        });



      this.map.on(GoogleMapsEvent.MAP_READY).subscribe(
        (data) => {
          console.log("Click MAP", data);
        }
      );
    })
      .catch(err => {
        //this.loading.dismiss();
        this.showToast(err.error_message);
      });
  }




  async showToast(message: string) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }
}
