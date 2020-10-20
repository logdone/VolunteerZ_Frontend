import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Comment } from './comment.model';
import { CommentService } from './comment.service';
import { Event, EventService } from '../event';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
    selector: 'page-comment-update',
    templateUrl: 'comment-update.html'
})
export class CommentUpdatePage implements OnInit {

    comment: Comment;
    events: Event[];
    users: User[];
    isSaving = false;
    isNew = true;
    isReadyToSave: boolean;

    form = this.formBuilder.group({
        id: [],
        commentBody: [null, [Validators.required]],
        event: [null, []],
        user: [null, []],
    });

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected navController: NavController,
        protected formBuilder: FormBuilder,
        public platform: Platform,
        protected toastCtrl: ToastController,
        private eventService: EventService,
        private userService: UserService,
        private commentService: CommentService
    ) {

        // Watch the form for changes, and
        this.form.valueChanges.subscribe((v) => {
            this.isReadyToSave = this.form.valid;
        });

    }

    ngOnInit() {
        this.eventService.query()
            .subscribe(data => { this.events = data.body; }, (error) => this.onError(error));
        this.userService.findAll().subscribe(data => this.users = data, (error) => this.onError(error));
        this.activatedRoute.data.subscribe((response) => {
            this.comment = response.data;
            this.isNew = this.comment.id === null || this.comment.id === undefined;
            this.updateForm(this.comment);
        });
    }

    updateForm(comment: Comment) {
        this.form.patchValue({
            id: comment.id,
            commentBody: comment.commentBody,
            event: comment.event,
            user: comment.user,
        });
    }

    save() {
        this.isSaving = true;
        const comment = this.createFromForm();
        if (!this.isNew) {
            this.subscribeToSaveResponse(this.commentService.update(comment));
        } else {
            this.subscribeToSaveResponse(this.commentService.create(comment));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<Comment>>) {
        result.subscribe((res: HttpResponse<Comment>) => this.onSaveSuccess(res), (res: HttpErrorResponse) => this.onError(res.error));
    }

    async onSaveSuccess(response) {
        let action = 'updated';
        if (response.status === 201) {
          action = 'created';
        }
        this.isSaving = false;
        const toast = await this.toastCtrl.create({message: `Comment ${action} successfully.`, duration: 2000, position: 'middle'});
        toast.present();
        this.navController.navigateBack('/tabs/entities/comment');
    }

    previousState() {
        window.history.back();
    }

    async onError(error) {
        this.isSaving = false;
        console.error(error);
        const toast = await this.toastCtrl.create({message: 'Failed to load data', duration: 2000, position: 'middle'});
        toast.present();
    }

    private createFromForm(): Comment {
        return {
            ...new Comment(),
            id: this.form.get(['id']).value,
            commentBody: this.form.get(['commentBody']).value,
            event: this.form.get(['event']).value,
            user: this.form.get(['user']).value,
        };
    }

    compareEvent(first: Event, second: Event): boolean {
        return first && first.id && second && second.id ? first.id === second.id : first === second;
    }

    trackEventById(index: number, item: Event) {
        return item.id;
    }
    compareUser(first: User, second: User): boolean {
        return first && first.id && second && second.id ? first.id === second.id : first === second;
    }

    trackUserById(index: number, item: User) {
        return item.id;
    }
}
