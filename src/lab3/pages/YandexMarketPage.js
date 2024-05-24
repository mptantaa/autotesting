const { By, until } = require('selenium-webdriver');
const BasePage = require('../BasePage');

class YandexMarketPage extends BasePage {
  constructor(driver) {
    super(driver);
  }

  async openYandexMarket() {
    return await this.driver.get('https://market.yandex.ru');
  }

  async openCatalog() {
    const catalogButton = await this.findPageElement(By.xpath("//button[.//span[text()='Каталог']]"));
    return await this.clickElement(catalogButton);
  }

  async hoverOnAllForGaming() {
    await this.driver.sleep(2000);
    const allForGaming = await this.findPageElement(By.xpath("//li//a[@href='/catalog--geiming/41813350']"));
    return await this.driver.actions().move({ origin: allForGaming }).perform();
  }

  async selectXboxGamingConsoles() {
    await this.driver.sleep(2000);
    const xboxLink = await this.driver.wait(until.elementLocated(By.xpath("//a[@href='/catalog--xbox/41813466']")), 10000);
    await this.driver.actions({ bridge: true }).move({ origin: xboxLink }).perform();
    await this.driver.wait(until.elementIsVisible(xboxLink), 1000);

    const gamingConsolesLink = await this.driver.wait(until.elementLocated(By.xpath("//a[contains(@href, '/catalog--igrovye-pristavki-xbox/')]")), 10000);
    await gamingConsolesLink.click();
  }

  async getFirstFiveProducts() {
    await this.driver.wait(until.elementLocated(By.xpath('//div[@data-zone-name="productSnippet"]')), 2000);
    const products = await this.driver.findElements(By.xpath('//div[@data-zone-name="productSnippet"]'));
    const firstFiveProducts = await Promise.all(products.slice(0, 5).map(async (product) => {
      const name = await product.findElement(By.xpath('.//h3[@data-auto="snippet-title"]')).getText();
      const price = await product.findElement(By.xpath('.//span[@data-auto="snippet-price-current"]')).getText();
      return { name, price };
    }));

    return firstFiveProducts;
  }

  async getFirstProduct() {
    const firstProduct = (await this.getFirstFiveProducts())[0];
    return firstProduct;
  }

  async addToFavoritesFirstProduct() {
    const firstProductHeart = await this.driver.findElement(By.xpath('//div[@data-zone-name="productSnippet"][1]//button[@title="Добавить в избранное"]'));
    await firstProductHeart.click();
  }
  
  async verifyProductAdded() {
    await this.driver.sleep(2000);
    const notification = await this.findPageElement(By.xpath('//div[@data-auto="notification"]//a[contains(text(), "Товар добавлен в избранное")]'));
    return notification.isDisplayed();
  }

  async openFavorites() {
    const favoritesButton = await this.findPageElement(By.css('a[href="/my/wishlist"]'));
    return await this.clickElement(favoritesButton);
  }

  async verifyFavoritesPageOpened() {
    const favoritesTitle = await this.driver.findElement(By.xpath('//span[contains(text(), "Избранное")]'));
    return favoritesTitle.isDisplayed();
  }

  async verifyProductInFavorites(expectedName, expectedPrice) {
    const products = await this.driver.findElements(By.xpath('//div[@data-zone-name="productSnippet"]'));

    for (const product of products) {
      const name = await product.findElement(By.xpath('.//h3[@data-auto="snippet-title"]')).getText();
      const price = await product.findElement(By.xpath('.//span[@data-auto="snippet-price-current"]')).getText();

      if (name === expectedName && price === expectedPrice) {
        return true;
      }
    }

    return false;
  }

  async removeFromFavoritesFirstProduct() {
    const firstProductHeart = await this.driver.findElement(By.xpath('//div[@data-zone-name="productSnippet"][1]//button[@title="Удалить из избранного"]'));
    await firstProductHeart.click();
  }

  async verifyProductRemovedFromFavorites() {
    const heart = await this.driver.findElement(By.xpath('//div[@data-zone-name="productSnippet"][1]//button[@title="Добавить в избранное"]'));
    return await heart.isDisplayed();
  }

  async refreshPage() {
    return await this.driver.navigate().refresh();
  }

  async verifyFavoritesEmpty() {
    const emptyMessage = await this.findPageElement(By.xpath("//span[text()='Войдите в аккаунт']"));
    return await emptyMessage.isDisplayed();
  }
}

module.exports = YandexMarketPage;
