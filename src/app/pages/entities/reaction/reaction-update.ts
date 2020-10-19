import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Reaction } from './reaction.model';
import { ReactionService } from './reaction.service';
import { Event, EventService } from '../event';
import { ExtendedUser, ExtendedUserService } from '../extended-user';

@Component({
  selector: 'page-reaction-update',
  templateUrl: 'reaction-update.html',
})
export class ReactionUpdatePage implements OnInit {
  reaction: Reaction;
  events: Event[];
  extendedUsers: ExtendedUser[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    event: [null, []],
    extendedUser: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private eventService: EventService,
    private extendedUserService: ExtendedUserService,
    private reactionService: ReactionService
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
    this.extendedUserService.query().subscribe(
      (data) => {
        this.extendedUsers = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.reaction = response.data;
      this.isNew = this.reaction.id === null || this.reaction.id === undefined;
      this.updateForm(this.reaction);
    });
  }

  updateForm(reaction: Reaction) {
    this.form.patchValue({
      id: reaction.id,
      event: reaction.event,
      extendedUser: reaction.extendedUser,
    });
  }

  save() {
    this.isSaving = true;
    const reaction = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.reactionService.update(reaction));
    } else {
      this.subscribeToSaveResponse(this.reactionService.create(reaction));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Reaction>>) {
    result.subscribe(
      (res: HttpResponse<Reaction>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Reaction ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/reaction');
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

  private createFromForm(): Reaction {
    return {
      ...new Reaction(),
      id: this.form.get(['id']).value,
      event: this.form.get(['event']).value,
      extendedUser: this.form.get(['extendedUser']).value,
    };
  }

  compareEvent(first: Event, second: Event): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackEventById(index: number, item: Event) {
    return item.id;
  }
  compareExtendedUser(first: ExtendedUser, second: ExtendedUser): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackExtendedUserById(index: number, item: ExtendedUser) {
    return item.id;
  }
}
