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

  constructor(protected activatedRoute: ActivatedRoute, public modalCtrl: ModalController, private formBuilder: FormBuilder, private accountService: AccountService,
    private eventService: EventService, private toastCtrl: ToastController, private navController: NavController) {
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
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
}
