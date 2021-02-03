import { Observable } from 'rxjs';
import { TimelineService } from './timeline.service';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AccountService } from 'src/app/services/auth/account.service';
import { LoginService } from 'src/app/services/login/login.service';
import { Account } from 'src/model/account.model';
import { Timeline } from './timeline';


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.page.html',
  styleUrls: ['./timeline.page.scss'],
})
export class TimelinePage implements OnInit {
  account: Account;
  data : Timeline[];
  constructor(public navController: NavController, private accountService: AccountService, private loginService: LoginService,private timelineService: TimelineService) {}

  ngOnInit() {
    this.accountService.identity().then((account) => {
      if (account === null) {
        this.goBackToHomePage();
      } else {
        this.account = account;
        this.timelineService.getAllTimeline(this.account.login).subscribe((data) => {
          this.data = data;
        });
      }
    });
  }

  isUnreacted(action){
    if (action == 'Unreacted '){
      return true;
    }
  }

  isReacted(action){
    if (action == 'Reacted to '){
      return true;
    }
  }

  isUnparticipated(action){
    if (action == 'Unparticipated to event '){
      return true;
    }
  }

  isParticipated(action){
    if (action == 'Participated to event '){
      return true;
    }
  }

  isCreatedEvent(action){
    if (action == 'Created event '){
      return true;
    }
  }

  isDeletedEvent(action){
    if (action == 'Deleted event '){
      return true;
    }
  }

  isReportedEvent(action){
    if (action == 'Reported event '){
      return true;
    }
  }

  isCreatedComment(action){
    if (action == 'Commented '){
      return true;
    }
  }

  isReportedComment(action){
    if (action == 'Reported comment '){
      return true;
    }
  }

  isDeletedComment(action){
    if (action == 'Deleted comment '){
      return true;
    }
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
}
