import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-entities',
  templateUrl: 'entities.page.html',
  styleUrls: ['entities.page.scss'],
})
export class EntitiesPage {
  entities: Array<any> = [
    { name: 'Event', component: 'EventPage', route: 'event' },
    { name: 'ExtendedUser', component: 'ExtendedUserPage', route: 'extended-user' },
    { name: 'Comment', component: 'CommentPage', route: 'comment' },
    { name: 'Reaction', component: 'ReactionPage', route: 'reaction' },
    /* jhipster-needle-add-entity-page - JHipster will add entity pages here */
  ];

  constructor(public navController: NavController) {}

  openPage(page) {
    this.navController.navigateForward('/tabs/entities/' + page.route);
  }
}
