const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
  
  console.log('Navigating to app tickets...');
  await page.goto('http://localhost:5173/app/tickets', { waitUntil: 'networkidle0' });
  
  console.log('Clicking Overview link...');
  // Find Overview link
  await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a'));
    const overviewLink = links.find(a => a.textContent.includes('Overview'));
    if (overviewLink) overviewLink.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  console.log('Closing...');
  await browser.close();
})();
