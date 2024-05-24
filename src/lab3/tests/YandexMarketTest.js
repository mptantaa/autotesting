const { By, Builder } = require('selenium-webdriver');
const assert = require('assert');
const YandexMarketPage = require('../pages/YandexMarketPage');
const fs = require('fs');

describe('Yandex Market - Добавление товара в избранное', function () {
  let page;
  let driver;
  let firstProduct;
  this.timeout(30000);

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
    page = new YandexMarketPage(driver);
    await page.openYandexMarket();
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

  it('Перейти по ссылке: https://market.yandex.ru', async function () {
    const title = await page.getPageTitle();
    assert.strictEqual(title.includes('Яндекс Маркет'), true, "Главная страница Яндекс Маркета не открылась");
  });

  it('В меню "Каталог" выбрать категорию: Все для гейминга -> Xbox -> Игровые приставки', async function () {
    await page.openCatalog();
    await page.hoverOnAllForGaming();
    await page.selectXboxGamingConsoles();
    const title = await page.getPageTitle();
    assert.strictEqual(title.includes('Игровые приставки'), true, "Страница 'Игровые приставки' не открылась");
  });

  it('Вывести в лог первые 5 найденных товаров (название и цену)', async function () {
    const products = await page.getFirstFiveProducts();
    products.forEach((product, index) => {
      console.log(`Продукт ${index + 1}: ${product.name} - ${product.price}`);
    });
  });

  it('Запомнить первую позицию из списка товаров (название и цену)', async function () {
    firstProduct = await page.getFirstProduct();
    assert(firstProduct, "Первый продукт не найден");
  });

  it('У первого товара в списке нажать кнопку с белым сердечком (Добавить в избранное)', async function () {
    await page.addToFavoritesFirstProduct();
    const notificationDisplayed = await page.verifyProductAdded();
    assert.strictEqual(notificationDisplayed, true, "Товар не добавлен в избранное");
  });

  it('На верхней панели нажать на кнопку "Избранное"', async function () {
    await page.openFavorites();
    const isFavoritesPageOpened = await page.verifyFavoritesPageOpened();
    assert.strictEqual(isFavoritesPageOpened, true, "Страница 'Избранное' не открылась");
  });

  it('Совпадает ли товар с добавленным', async function () {
    const productInFavorites = await page.verifyProductInFavorites(firstProduct.name, firstProduct.price);
    assert.strictEqual(productInFavorites, true, "Товар не совпадает");
  });

  it('Нажать на кнопку "Удалить из избранного" (красное сердечко) рядом с добавленным товаром', async function () {
    await page.removeFromFavoritesFirstProduct();
    const isRemovedFromFavorites = await page.verifyProductRemovedFromFavorites();
    assert.strictEqual(isRemovedFromFavorites, true, "Товар не был удален из избранного");
  });

  it('Обновить страницу', async function () {
    await page.refreshPage();
    const isFavoritesEmpty = await page.verifyFavoritesEmpty();
    assert.strictEqual(isFavoritesEmpty, true, "Товар все еще отображается в избранном");
  });
});
