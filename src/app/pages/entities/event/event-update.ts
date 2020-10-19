import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Event } from './event.model';
import { EventService } from './event.service';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'page-event-update',
  templateUrl: 'event-update.html',
})
export class EventUpdatePage implements OnInit {
  event: Event;
  users: User[];
  creationDate: string;
  eventDate: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    title: [null, [Validators.required]],
    eventDescription: [null, []],
    eventImage: [null, []],
    category: [null, []],
    creationDate: [null, [Validators.required]],
    eventDate: [null, [Validators.required]],
    maxNumberVolunteers: [null, []],
    nbrReports: [null, []],
    link: [null, []],
    location: [null, [Validators.required]],
    owner: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private userService: UserService,
    private eventService: EventService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.userService.findAll().subscribe(
      (data) => (this.users = data),
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.event = response.data;
      this.isNew = this.event.id === null || this.event.id === undefined;
      this.updateForm(this.event);
    });
  }

  updateForm(event: Event) {
    this.form.patchValue({
      id: event.id,
      title: event.title,
      eventDescription: event.eventDescription,
      eventImage: event.eventImage,
      category: event.category,
      creationDate: this.isNew ? new Date().toISOString() : event.creationDate,
      eventDate: this.isNew ? new Date().toISOString() : event.eventDate,
      maxNumberVolunteers: event.maxNumberVolunteers,
      nbrReports: event.nbrReports,
      link: event.link,
      location: event.location,
      owner: event.owner,
    });
  }

  save() {
    this.isSaving = true;
    const event = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.eventService.update(event));
    } else {
      this.subscribeToSaveResponse(this.eventService.create(event));
    }
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
    this.navController.navigateBack('/tabs/entities/event');
  }

  previousState() {
    window.history.back();
  }

  async onError(error) {
    this.isSaving = false;
    console.error(error);
    const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
    toast.present();
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
      nbrReports: this.form.get(['nbrReports']).value,
      link: this.form.get(['link']).value,
      location: this.form.get(['location']).value,
      owner: this.form.get(['owner']).value,
    };
  }

  compareUser(first: User, second: User): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackUserById(index: number, item: User) {
    return item.id;
  }
}
