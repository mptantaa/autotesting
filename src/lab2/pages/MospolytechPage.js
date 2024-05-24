const { By } = require('selenium-webdriver');
const BasePage = require('../BasePage');

class MospolytechPage extends BasePage {
  constructor(driver) {
    super(driver);
  }

  async openMospolytechPage() {
    return await this.driver.get('https://mospolytech.ru/');
  }

  async clickTimetableButton() {
    const timetableButton = await this.findPageElement(By.css('a[title="Расписание"]'));
    return await this.clickElement(timetableButton);
  }

  async clickSeeOnWebsite() {
    const seeOnWebsiteButton = await this.findPageElement(By.xpath("//a[@href='https://rasp.dmami.ru/']"));
    await this.clickElement(seeOnWebsiteButton);
    return await this.switchToNewTab();
  }

  async enterGroupNumber(groupNumber) {
    const searchField = await this.findPageElement(By.css('input.groups'));
    return await this.enterText(searchField, groupNumber);
  }

  async clickOnGroup(groupNumber) {
    const groupElement = await this.waitForElement(By.id(groupNumber));
    return await this.clickElement(groupElement);
  }

  async verifyTimetableOpened() {
    await this.waitForElement(By.css('.schedule'), 10000);
    const scheduleElement = await this.waitForElement(By.css('.schedule-week'));
    return scheduleElement !== null;
  }
}

module.exports = MospolytechPage;
