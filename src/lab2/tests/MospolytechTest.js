const { By, Builder } = require('selenium-webdriver');
const assert = require('assert');
const MospolytechPage = require('../pages/MospolytechPage');
const fs = require('fs');

describe('Mospolytech расписание тест', function () {
  let page;
  let driver;
  this.timeout(15000);

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
    page = new MospolytechPage(driver);
    await page.openMospolytechPage();
    this.timeout(15000);
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  afterEach(async function() {
    const testStatus = this.currentTest.state;
    if (driver && testStatus === 'failed') {
      const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '__').split('.')[0];
      const screenshotName = `${this.currentTest.title}_${timestamp}.png`;
      const screenshot = await driver.takeScreenshot();
      fs.writeFileSync(`./screenshots/${screenshotName}`, screenshot, 'base64');
    }
  });

  it('проверка перехода на страницу расписания', async function () {
    await page.clickTimetableButton();
    await page.clickSeeOnWebsite();
    const title = await page.getPageTitle();
    assert.strictEqual(title.includes('Расписание'), true, "Заголовок не содержит 'Расписание'");
  });

  it('проверка поиска расписания группы', async function () {
    const groupNumber = '221-323';
    await page.enterGroupNumber(groupNumber);
    const groupElement = await page.waitForElement(By.id(groupNumber));
    assert.strictEqual(await groupElement.getText(), groupNumber, "Группа не найдена в результатах поиска");
  });

  it('проверка открытия расписания группы', async function () {
    const groupNumber = '221-323';
    await page.clickOnGroup(groupNumber);
    const isTimetableOpened = await page.verifyTimetableOpened();
    assert.strictEqual(isTimetableOpened, true, "Расписание открылось некорректно");
  });

});
