import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { CommentComponentsPage, CommentDetailPage, CommentUpdatePage } from './comment.po';

describe('Comment e2e test', () => {
  let loginPage: LoginPage;
  let commentComponentsPage: CommentComponentsPage;
  let commentUpdatePage: CommentUpdatePage;
  let commentDetailPage: CommentDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Comments';
  const SUBCOMPONENT_TITLE = 'Comment';
  let lastElement: any;
  let isVisible = false;

  const commentBody = 'commentBody';

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

  it('should load Comments', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Comment')
      .first()
      .click();

    commentComponentsPage = new CommentComponentsPage();
    await browser.wait(ec.visibilityOf(commentComponentsPage.title), 5000);
    expect(await commentComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(commentComponentsPage.entities.get(0)), ec.visibilityOf(commentComponentsPage.noResult)),
      5000
    );
  });

  it('should create Comment', async () => {
    initNumberOfEntities = await commentComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(commentComponentsPage.createButton), 5000);
    await commentComponentsPage.clickOnCreateButton();
    commentUpdatePage = new CommentUpdatePage();
    await browser.wait(ec.visibilityOf(commentUpdatePage.pageTitle), 1000);
    expect(await commentUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await commentUpdatePage.setCommentBodyInput(commentBody);

    await commentUpdatePage.save();
    await browser.wait(ec.visibilityOf(commentComponentsPage.title), 1000);
    expect(await commentComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await commentComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Comment', async () => {
    commentComponentsPage = new CommentComponentsPage();
    await browser.wait(ec.visibilityOf(commentComponentsPage.title), 5000);
    lastElement = await commentComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Comment', async () => {
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

  it('should view the last Comment', async () => {
    commentDetailPage = new CommentDetailPage();
    if (isVisible && (await commentDetailPage.pageTitle.isDisplayed())) {
      expect(await commentDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await commentDetailPage.getCommentBodyInput()).toEqual(commentBody);
    }
  });

  it('should delete last Comment', async () => {
    commentDetailPage = new CommentDetailPage();
    if (isVisible && (await commentDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await commentDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(commentComponentsPage.title), 3000);
      expect(await commentComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await commentComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Comments tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
