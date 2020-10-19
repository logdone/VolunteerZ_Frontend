import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { EventComponentsPage, EventDetailPage, EventUpdatePage } from './event.po';

describe('Event e2e test', () => {
  let loginPage: LoginPage;
  let eventComponentsPage: EventComponentsPage;
  let eventUpdatePage: EventUpdatePage;
  let eventDetailPage: EventDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Events';
  const SUBCOMPONENT_TITLE = 'Event';
  let lastElement: any;
  let isVisible = false;

  const title = 'title';
  const eventDescription = 'eventDescription';
  const eventImage = 'eventImage';
  const category = 'category';
  const maxNumberVolunteers = '10';
  const nbrReports = '10';
  const link = 'link';
  const location = 'location';

  beforeAll(async () => {
    loginPage = new LoginPage();
    await loginPage.navigateTo('/');
    await loginPage.signInButton.click();
    const username = process.env.E2E_USERNAME || 'admin';
    const password = process.env.E2E_PASSWORD || 'admin';
    await browser.wait(ec.elementToBeClickable(loginPage.loginButton), 3000);
    await loginPage.login(username, password);
    await browser.wait(ec.visibilityOf(loginPage.logoutButton), 1000);
  });

  it('should load Events', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Event')
      .first()
      .click();

    eventComponentsPage = new EventComponentsPage();
    await browser.wait(ec.visibilityOf(eventComponentsPage.title), 5000);
    expect(await eventComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(ec.or(ec.visibilityOf(eventComponentsPage.entities.get(0)), ec.visibilityOf(eventComponentsPage.noResult)), 5000);
  });

  it('should create Event', async () => {
    initNumberOfEntities = await eventComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(eventComponentsPage.createButton), 5000);
    await eventComponentsPage.clickOnCreateButton();
    eventUpdatePage = new EventUpdatePage();
    await browser.wait(ec.visibilityOf(eventUpdatePage.pageTitle), 1000);
    expect(await eventUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await eventUpdatePage.setTitleInput(title);
    await eventUpdatePage.setEventDescriptionInput(eventDescription);
    await eventUpdatePage.setEventImageInput(eventImage);
    await eventUpdatePage.setCategoryInput(category);
    await eventUpdatePage.setMaxNumberVolunteersInput(maxNumberVolunteers);
    await eventUpdatePage.setNbrReportsInput(nbrReports);
    await eventUpdatePage.setLinkInput(link);
    await eventUpdatePage.setLocationInput(location);

    await eventUpdatePage.save();
    await browser.wait(ec.visibilityOf(eventComponentsPage.title), 1000);
    expect(await eventComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await eventComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Event', async () => {
    eventComponentsPage = new EventComponentsPage();
    await browser.wait(ec.visibilityOf(eventComponentsPage.title), 5000);
    lastElement = await eventComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Event', async () => {
    browser
      .executeScript('arguments[0].scrollIntoView()', lastElement)
      .then(async () => {
        if ((await lastElement.isEnabled()) && (await lastElement.isDisplayed())) {
          browser
            .executeScript('arguments[0].click()', lastElement)
            .then(async () => {
              isVisible = true;
            })
            .catch();
        }
      })
      .catch();
  });

  it('should view the last Event', async () => {
    eventDetailPage = new EventDetailPage();
    if (isVisible && (await eventDetailPage.pageTitle.isDisplayed())) {
      expect(await eventDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await eventDetailPage.getTitleInput()).toEqual(title);

      expect(await eventDetailPage.getEventDescriptionInput()).toEqual(eventDescription);

      expect(await eventDetailPage.getEventImageInput()).toEqual(eventImage);

      expect(await eventDetailPage.getCategoryInput()).toEqual(category);

      expect(await eventDetailPage.getMaxNumberVolunteersInput()).toEqual(maxNumberVolunteers);

      expect(await eventDetailPage.getNbrReportsInput()).toEqual(nbrReports);

      expect(await eventDetailPage.getLinkInput()).toEqual(link);

      expect(await eventDetailPage.getLocationInput()).toEqual(location);
    }
  });

  it('should delete last Event', async () => {
    eventDetailPage = new EventDetailPage();
    if (isVisible && (await eventDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await eventDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(eventComponentsPage.title), 3000);
      expect(await eventComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await eventComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Events tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
