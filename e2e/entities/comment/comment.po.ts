import { element, by, browser, ElementFinder } from 'protractor';

export class CommentComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Comments found.'));
  entities = element.all(by.css('page-comment ion-item'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastViewButton(): Promise<void> {
    await this.viewButtons.last().click();
  }

  async getTitle(): Promise<string> {
    return this.title.getText();
  }

  async getEntitiesNumber(): Promise<number> {
    return await this.entities.count();
  }
}

export class CommentUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  commentBodyInput = element(by.css('ion-input[formControlName="commentBody"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setCommentBodyInput(commentBody: string): Promise<void> {
    await this.commentBodyInput.sendKeys(commentBody);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class CommentDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  commentBodyInput = element.all(by.css('span')).get(1);

  async getCommentBodyInput(): Promise<string> {
    return await this.commentBodyInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
