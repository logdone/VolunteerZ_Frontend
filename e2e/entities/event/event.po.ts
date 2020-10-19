import { element, by, browser, ElementFinder } from 'protractor';

export class EventComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Events found.'));
  entities = element.all(by.css('page-event ion-item'));

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

export class EventUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  titleInput = element(by.css('ion-input[formControlName="title"] input'));
  eventDescriptionInput = element(by.css('ion-input[formControlName="eventDescription"] input'));
  eventImageInput = element(by.css('ion-input[formControlName="eventImage"] input'));
  categoryInput = element(by.css('ion-input[formControlName="category"] input'));
  maxNumberVolunteersInput = element(by.css('ion-input[formControlName="maxNumberVolunteers"] input'));
  nbrReportsInput = element(by.css('ion-input[formControlName="nbrReports"] input'));
  linkInput = element(by.css('ion-input[formControlName="link"] input'));
  locationInput = element(by.css('ion-input[formControlName="location"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setTitleInput(title: string): Promise<void> {
    await this.titleInput.sendKeys(title);
  }
  async setEventDescriptionInput(eventDescription: string): Promise<void> {
    await this.eventDescriptionInput.sendKeys(eventDescription);
  }
  async setEventImageInput(eventImage: string): Promise<void> {
    await this.eventImageInput.sendKeys(eventImage);
  }
  async setCategoryInput(category: string): Promise<void> {
    await this.categoryInput.sendKeys(category);
  }
  async setMaxNumberVolunteersInput(maxNumberVolunteers: string): Promise<void> {
    await this.maxNumberVolunteersInput.sendKeys(maxNumberVolunteers);
  }
  async setNbrReportsInput(nbrReports: string): Promise<void> {
    await this.nbrReportsInput.sendKeys(nbrReports);
  }
  async setLinkInput(link: string): Promise<void> {
    await this.linkInput.sendKeys(link);
  }
  async setLocationInput(location: string): Promise<void> {
    await this.locationInput.sendKeys(location);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class EventDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  titleInput = element.all(by.css('span')).get(1);

  eventDescriptionInput = element.all(by.css('span')).get(2);

  eventImageInput = element.all(by.css('span')).get(3);

  categoryInput = element.all(by.css('span')).get(4);

  maxNumberVolunteersInput = element.all(by.css('span')).get(7);

  nbrReportsInput = element.all(by.css('span')).get(8);

  linkInput = element.all(by.css('span')).get(9);

  locationInput = element.all(by.css('span')).get(10);

  async getTitleInput(): Promise<string> {
    return await this.titleInput.getText();
  }

  async getEventDescriptionInput(): Promise<string> {
    return await this.eventDescriptionInput.getText();
  }

  async getEventImageInput(): Promise<string> {
    return await this.eventImageInput.getText();
  }

  async getCategoryInput(): Promise<string> {
    return await this.categoryInput.getText();
  }

  async getMaxNumberVolunteersInput(): Promise<string> {
    return await this.maxNumberVolunteersInput.getText();
  }

  async getNbrReportsInput(): Promise<string> {
    return await this.nbrReportsInput.getText();
  }

  async getLinkInput(): Promise<string> {
    return await this.linkInput.getText();
  }

  async getLocationInput(): Promise<string> {
    return await this.locationInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
