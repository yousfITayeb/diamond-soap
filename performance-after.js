const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const url = 'file:///C:/Users/tyous/OneDrive/Desktop/vcard/diamond-soap/index.html';
  await page.goto(url, { waitUntil: 'load' });
  // Wait for potential LCP and layout shifts
  await page.waitForTimeout(6000);
  const metrics = await page.evaluate(() => {
    // Largest Contentful Paint
    const lcpEntry = performance.getEntriesByName('largest-contentful-paint').pop();
    let lcp = null, lcpTag = null, lcpSrc = null;
    if (lcpEntry && lcpEntry.startTime) {
      lcp = lcpEntry.startTime;
      if (lcpEntry.element) {
        const el = lcpEntry.element;
        lcpTag = el.tagName;
        if (el.tagName === 'IMG') lcpSrc = el.currentSrc || el.src;
      }
    }
    // CLS
    const cls = performance.getEntriesByType('layout-shift')
      .reduce((sum, e) => sum + (e.value || 0), 0);
    // TBT (total blocking time)
    const longTasks = performance.getEntriesByType('longtask');
    let tbt = 0;
    longTasks.forEach(t => {
      if (t.duration > 50) tbt += t.duration - 50;
    });
    return { lcp, lcpTag, lcpSrc, cls, tbt };
  });
  const fs = require('fs');
  fs.writeFileSync('performance_after.json', JSON.stringify(metrics, null, 2));
  console.log('Metrics captured:', metrics);
  await browser.close();
})();
