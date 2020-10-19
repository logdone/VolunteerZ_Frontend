import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { ReactionComponentsPage, ReactionDetailPage, ReactionUpdatePage } from './reaction.po';

describe('Reaction e2e test', () => {
  let loginPage: LoginPage;
  let reactionComponentsPage: ReactionComponentsPage;
  let reactionUpdatePage: ReactionUpdatePage;
  let reactionDetailPage: ReactionDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Reactions';
  const SUBCOMPONENT_TITLE = 'Reaction';
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

  it('should load Reactions', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Reaction')
      .first()
      .click();

    reactionComponentsPage = new ReactionComponentsPage();
    await browser.wait(ec.visibilityOf(reactionComponentsPage.title), 5000);
    expect(await reactionComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(reactionComponentsPage.entities.get(0)), ec.visibilityOf(reactionComponentsPage.noResult)),
      5000
    );
  });

  it('should create Reaction', async () => {
    initNumberOfEntities = await reactionComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(reactionComponentsPage.createButton), 5000);
    await reactionComponentsPage.clickOnCreateButton();
    reactionUpdatePage = new ReactionUpdatePage();
    await browser.wait(ec.visibilityOf(reactionUpdatePage.pageTitle), 1000);
    expect(await reactionUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await reactionUpdatePage.save();
    await browser.wait(ec.visibilityOf(reactionComponentsPage.title), 1000);
    expect(await reactionComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await reactionComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Reaction', async () => {
    reactionComponentsPage = new ReactionComponentsPage();
    await browser.wait(ec.visibilityOf(reactionComponentsPage.title), 5000);
    lastElement = await reactionComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Reaction', async () => {
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

  it('should view the last Reaction', async () => {
    reactionDetailPage = new ReactionDetailPage();
    if (isVisible && (await reactionDetailPage.pageTitle.isDisplayed())) {
      expect(await reactionDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);
    }
  });

  it('should delete last Reaction', async () => {
    reactionDetailPage = new ReactionDetailPage();
    if (isVisible && (await reactionDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await reactionDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(reactionComponentsPage.title), 3000);
      expect(await reactionComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await reactionComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Reactions tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
