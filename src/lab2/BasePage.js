const { By, Key, until } = require('selenium-webdriver');

class BasePage {
  constructor(driver) {
    this.driver = driver;
  }

  async findPageElement(locator) {
    return await this.driver.findElement(locator);
  }

  async clickElement(element) {
    await element.click();
  }

  async enterText(element, text) {
    await element.sendKeys(text, Key.RETURN);
  }

  async getPageTitle() {
    return await this.driver.getTitle();
  }

  async switchToNewTab() {
    const handles = await this.driver.getAllWindowHandles();
    await this.driver.switchTo().window(handles[handles.length - 1]);
  }

  async closeCurrentTab() {
    await this.driver.close();
    const handles = await this.driver.getAllWindowHandles();
    await this.driver.switchTo().window(handles[handles.length - 1]);
  }

  async waitForElement(locator, timeout = 10000) {
    return await this.driver.wait(until.elementLocated(locator), timeout);
  }
}

module.exports = BasePage;
