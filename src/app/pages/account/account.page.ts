import { Component, OnInit } from '@angular/core';
import { Account } from 'src/model/account.model';
import { AccountService } from 'src/app/services/auth/account.service';

@Component({
  selector: 'app-account',
  templateUrl: 'account.page.html',
  styleUrls: ['account.page.scss'],
})
export class AccountPage {
  account: Account;

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.accountService.identity().then((account) => {
        this.account = account;
    });
  }
}