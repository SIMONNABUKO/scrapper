const puppeteer = require('puppeteer');
const credentials = require('./credentials');
const path = require('path');
//Loads the express module
const express = require('express');
//Creates our express server
const app = express();
const port = 3000;
//Loads the handlebars module
const handlebars = require('express-handlebars');
//Sets our app to use the handlebars engine
app.engine(
  'hbs',
  handlebars({
    defaultLayout: 'index',
    layoutsDir: path.join(__dirname, '/public/views/layouts'),
    partialsDir: path.join(__dirname, '/public/views/partials'),
    extname: 'hbs',
  })
);
app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'hbs');

app.use(express.static('public'));
app.get('/', (req, res) => {
  //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
  res.render('main', { layout: 'index' });
});

const fetchAds = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto('https://www.pigiame.co.ke/', {
    waitUntil: 'networkidle2',
  });

  await console.log('waiting for search selector...');
  await page.waitFor(credentials.searchSelector);
  await console.log('searchSelectorrendered...');
  await page.click(credentials.searchSelector);
  await console.log('clicked on searchSelector...');
  await page.keyboard.type('tecno');
  await console.log('Typed tecno...');
  await page.click(credentials.searchBtnSelector);
  await console.log('clicked on searchBtnSelector...');
  await console.log('waiting for ItemSelector...');
  await page.waitFor(credentials.itemSelector);

  let itemsLength = await page.evaluate(() => {
    let itemSelector =
      '.listings-cards__list-item >div>a> div:nth-child(2)>div>div>div:nth-child(1)';
    let items = document.querySelectorAll(itemSelector);
    let allItems = [];
    Array.from(items).map(() => {
      domItem = {
        itemTitle: document.querySelector('.listing-card__header__title')
          .innerText,
        itemDatePosted: document.querySelector('.listing-card__header__date')
          .innerText,
        itemLocation: document.querySelector(
          '.listing-card__header__tags>span:nth-child(3)'
        ).innerText,
        itemPrice: document.querySelector(
          '.listing-card__info-bar__price>span>span'
        ).innerText,
      };
      allItems = [...domItem];
    });
    return allItems;
  });
  await console.log(itemsLength);

  // await page.click(credentials.itemSelector);
  // await console.log('waiting for page to load content...');
  // await page.waitFor(5000);
  // await page.click(credentials.sellerShowPhoneBtnSelector);
  // await console.log('clicked on showPhone Button...');
  // await page.waitFor(1000);

  await page.screenshot({ path: 'docs/details2.png' });
  await console.log('Taken screenshot');
  // await page.pdf({ path: 'docs/details2.pdf', format: 'A4' });
  // await console.log('saved pdf');
  await console.log('closing browser');
  await browser.close();
};

//Makes the app listen to port 3000
app.listen(port, () => console.log(`App listening to port ${port}`));
