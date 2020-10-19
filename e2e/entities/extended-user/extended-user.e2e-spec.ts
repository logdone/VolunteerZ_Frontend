import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { ExtendedUserComponentsPage, ExtendedUserDetailPage, ExtendedUserUpdatePage } from './extended-user.po';

describe('ExtendedUser e2e test', () => {
  let loginPage: LoginPage;
  let extendedUserComponentsPage: ExtendedUserComponentsPage;
  let extendedUserUpdatePage: ExtendedUserUpdatePage;
  let extendedUserDetailPage: ExtendedUserDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Extended Users';
  const SUBCOMPONENT_TITLE = 'Extended User';
  let lastElement: any;
  let isVisible = false;

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

  it('should load ExtendedUsers', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'ExtendedUser')
      .first()
      .click();

    extendedUserComponentsPage = new ExtendedUserComponentsPage();
    await browser.wait(ec.visibilityOf(extendedUserComponentsPage.title), 5000);
    expect(await extendedUserComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(extendedUserComponentsPage.entities.get(0)), ec.visibilityOf(extendedUserComponentsPage.noResult)),
      5000
    );
  });

  it('should create ExtendedUser', async () => {
    initNumberOfEntities = await extendedUserComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(extendedUserComponentsPage.createButton), 5000);
    await extendedUserComponentsPage.clickOnCreateButton();
    extendedUserUpdatePage = new ExtendedUserUpdatePage();
    await browser.wait(ec.visibilityOf(extendedUserUpdatePage.pageTitle), 1000);
    expect(await extendedUserUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await extendedUserUpdatePage.save();
    await browser.wait(ec.visibilityOf(extendedUserComponentsPage.title), 1000);
    expect(await extendedUserComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await extendedUserComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last ExtendedUser', async () => {
    extendedUserComponentsPage = new ExtendedUserComponentsPage();
    await browser.wait(ec.visibilityOf(extendedUserComponentsPage.title), 5000);
    lastElement = await extendedUserComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last ExtendedUser', async () => {
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

  it('should view the last ExtendedUser', async () => {
    extendedUserDetailPage = new ExtendedUserDetailPage();
    if (isVisible && (await extendedUserDetailPage.pageTitle.isDisplayed())) {
      expect(await extendedUserDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);
    }
  });

  it('should delete last ExtendedUser', async () => {
    extendedUserDetailPage = new ExtendedUserDetailPage();
    if (isVisible && (await extendedUserDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await extendedUserDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(extendedUserComponentsPage.title), 3000);
      expect(await extendedUserComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await extendedUserComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish ExtendedUsers tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
