const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto('https://peternjeru.co.ke/safdaraja/ui/', {
    waitUntil: 'networkidle2',
  });
  await console.log('Navigated to the page...');

  // await page.screenshot({ path: 'docs/nodeJsHeroku.png' });
  // await console.log('Taken screenshot');
  await page.pdf({
    path: 'docs/mpesa.pdf',
    format: 'A4',
    printBackground: true,
  });
  await console.log('saved pdf');
  await console.log('closing browser');
  await browser.close();
})();
