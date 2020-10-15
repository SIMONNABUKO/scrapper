const puppeteer = require('puppeteer');
const category = 'electronics';
(async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    // set user agent (override the default headless User Agent)
    await page.setUserAgent(
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36'
    );
    await page.setDefaultNavigationTimeout(0);
    // await page.goto(`https://www.pigiame.co.ke/${category}`, {
    //   waitUntil: 'networkidle2',
    // });
    // await page.waitForSelector('.listings-cards__list-item');
    // const listings = await page.$$('.listings-cards__list-item');
    for (let i = 0; i < 10; i++) {
      await page.goto(`https://www.pigiame.co.ke/${category}`);
      await page.waitForSelector('.listings-cards__list-item');
      const listings = await page.$$('.listings-cards__list-item');

      const item = listings[i];
      // const itemName = await page.evaluate((item) => item.innerText, item);
      // console.log(itemName);
      await item.click(item);
      await page.waitForSelector('.listing-item__description');
      const itemContainer = await page.$('.listing-page__content');
      const itemName = await itemContainer.$eval(
        '.listing-card__header__title',
        (element) => element.innerText
      );
      const itemRegion = await itemContainer.$eval(
        '.listing-item__address-region',
        (element) => element.innerText
      ).innerText;
      const itemLocation = await itemContainer.$eval(
        '.listing-item__address-location',
        (element) => element.innerText
      ).innerText;
      const itemPrice = await itemContainer.$eval(
        '.listing-card__price__value',
        (element) => element.innerText
      );
      const datePosted = await itemContainer.$eval(
        '.listing-item__details__date',
        (element) => element.innerText
      );
      const itemDescription = await itemContainer.$eval(
        '.listing-item__description > :nth-child(3)',
        (element) => element.innerText
      );
      console.log(`Name:${itemName}, Price: ${itemPrice}`);
    }

    // await page.screenshot({ path: 'docs/puppeteerDocs.png' });
    // await console.log('Taken screenshot');
    // await page.pdf({ path: 'docs/puppeteerDocs.pdf', format: 'A4' });
    // await console.log('saved pdf');
    // await console.log('closing browser');
    await browser.close();
  } catch (error) {
    console.log(`our error: ${error}`);
  }
})();
