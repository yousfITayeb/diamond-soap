const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const filePath = 'file:///C:/Users/tyous/OneDrive/Desktop/vcard/diamond-soap/index.html';
  await page.goto(filePath, { waitUntil: 'load' });
  await page.waitForTimeout(5000);
  const entries = await page.evaluate(() => performance.getEntries().map(e => ({ name: e.name, entryType: e.entryType, startTime: e.startTime, duration: e.duration, details: e.toJSON ? e.toJSON() : null })));
  const fs = require('fs');
  fs.writeFileSync('entries_dump.json', JSON.stringify(entries, null, 2));
  console.log('Dumped entries count:', entries.length);
  await browser.close();
})();
