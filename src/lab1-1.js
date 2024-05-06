const { Builder, By, Key } = require('selenium-webdriver');
const assert = require('assert');

async function lambdaTest() {
  const driver = await new Builder().forBrowser('firefox').build();

  try {
    await driver.get('https://lambdatest.github.io/sample-todo-app/');
    console.log('Проверка заголовка страницы');
    assert.strictEqual(await driver.getTitle(), 'Sample page - lambdatest.com', "Заголовок неверный");
    console.log('Заголовок верный');

    console.log('Проверка наличия текста "5 of 5 remaining"');
    await driver.findElement(By.xpath("//*[text()='5 of 5 remaining']"));
    console.log('Текст "5 of 5 remaining" присутствует');

    console.log('Получение чекбоксов');
    let inputBoxes = await driver.findElements(By.xpath("//li/span[@class='done-false']/preceding-sibling::input"));
    assert.strictEqual(inputBoxes.length, 5, "Некорректный номер чекбоксов");
    
    for (let i = 0; i < inputBoxes.length; i++) {
      console.log(`Клик на чекбокс под номером ${i + 1}`);
      await inputBoxes[i].click();
      console.log('Клик сделан успешно');
      
      let itemClass = await driver.findElement(By.xpath(`//li[${i + 1}]/span`)).getAttribute('class');
      assert.ok(itemClass.includes('done-true'), "Пункт не зачеркнут");
      const afterClick = await driver.findElement(By.xpath(`//*[text()='${4 - i} of 5 remaining']`)).getText();
      console.log(`Статус после клика на элемент ${i + 1}: ${afterClick}`);
    }

    await driver.findElement(By.id('sampletodotext')).sendKeys("New item", Key.RETURN);
    await driver.findElement(By.xpath("//*[contains(text(),'1 of 6 remaining')]"));
  } catch (error) {
    console.error('Ошибка:', error);
    driver.takeScreenshot().then(function(image) {
      require('fs').writeFileSync('screenshot_error.png', image, 'base64');
    });
  } finally {
    console.log('Закрытие браузера');
    await driver.quit();
  }
}

lambdaTest();
