const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const category = 'electronics';
const width = 1024;
const height = 10000;
(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: { width: width, height: height },
    });
    const page = await browser.newPage();
    await page.setViewport({ width: width, height: height });
    await page.setUserAgent(
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36'
    );
    await page.setDefaultNavigationTimeout(0);
    //Initial Code here
    await page.goto(`https://www.emploi.co/vacancies`, {
      waitUntil: 'networkidle2',
    });
    let docName = 'emploiJobs' + Date.now() + '.csv';
    fs.writeFile(
      docName,
      'Title, Positions,Location,Type,Posted, DateOfScrapping\n'
    );
    for (let i = 0; i < 15; i++) {
      await page.goto(`https://www.emploi.co/vacancies`);
      await page.waitForSelector('.col-12.col-lg-8 > div > div.col-8 > h4 > a');
      const listings = await page.$$(
        '.col-12.col-lg-8 > div > div.col-8 > h4 > a'
      );
      const item = listings[i];
      const itemName = await page.evaluate((item) => item.innerText, item);

      await item.click();
      await page.waitForSelector(' h2');

      const jobTitle = await page.$('h2');
      const title = await page.evaluate(
        (jobTitle) => jobTitle.innerText,
        jobTitle
      );
      const pos = await page.$('.badge-secondary');
      const positions = await page.evaluate((pos) => pos.innerText, pos);
      const loc = await page.$(
        '#job-description > div > div > div.row.pb-3 > div.col-12.col-md-6.col-lg-7 > p'
      );
      const location = await page.evaluate((loc) => loc.innerText, loc);
      const cat = await page.$(
        '.justify-content-between.text-sm-left.text-md-right > p > a'
      );
      const category = await page.evaluate((cat) => cat.innerText, cat);
      const taip = await page.$(
        '.justify-content-between.text-sm-left.text-md-right > p > a> span'
      );
      const jobType = await page.evaluate((taip) => taip.innerText, taip);
      const pstd = await page.$(
        '.justify-content-between.text-sm-left.text-md-right > p > span'
      );
      const timePosted = await page.evaluate((pstd) => pstd.innerText, pstd);
      const desc = await page.$('#job-description > div > div > div');
      const jobDescription = await page.evaluate(
        (desc) => desc.innerHTML,
        desc
      );

      // const data = {
      //   title,
      //   positions,
      //   location,
      //   category,
      //   jobType,
      //   timePosted,
      //   jobDescription,
      // };

      await fs.appendFile(
        docName,
        `"${title}","${positions}","${location}","${jobType}","${timePosted}",${new Date().toISOString()}\n`
      );

      console.log('Done! Data saved.');
    }
    await browser.close();
  } catch (error) {
    console.log(`our error: ${error}`);
  }
})();

