import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ExtendedUser } from './extended-user.model';
import { ExtendedUserService } from './extended-user.service';
import { Event, EventService } from '../event';

@Component({
  selector: 'page-extended-user-update',
  templateUrl: 'extended-user-update.html',
})
export class ExtendedUserUpdatePage implements OnInit {
  extendedUser: ExtendedUser;
  events: Event[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    event: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private eventService: EventService,
    private extendedUserService: ExtendedUserService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.eventService.query().subscribe(
      (data) => {
        this.events = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.extendedUser = response.data;
      this.isNew = this.extendedUser.id === null || this.extendedUser.id === undefined;
      this.updateForm(this.extendedUser);
    });
  }

  updateForm(extendedUser: ExtendedUser) {
    this.form.patchValue({
      id: extendedUser.id,
      event: extendedUser.event,
    });
  }

  save() {
    this.isSaving = true;
    const extendedUser = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.extendedUserService.update(extendedUser));
    } else {
      this.subscribeToSaveResponse(this.extendedUserService.create(extendedUser));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ExtendedUser>>) {
    result.subscribe(
      (res: HttpResponse<ExtendedUser>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `ExtendedUser ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/extended-user');
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

  private createFromForm(): ExtendedUser {
    return {
      ...new ExtendedUser(),
      id: this.form.get(['id']).value,
      event: this.form.get(['event']).value,
    };
  }

  compareEvent(first: Event, second: Event): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackEventById(index: number, item: Event) {
    return item.id;
  }
}
