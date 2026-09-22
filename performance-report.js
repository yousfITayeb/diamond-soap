const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  // Use file URL for local path
  const filePath = 'file:///C:/Users/tyous/OneDrive/Desktop/vcard/diamond-soap/index.html';
  await page.goto(filePath, { waitUntil: 'load' });
  // Wait a bit to allow LCP and layout shifts
  await page.waitForTimeout(5000);
  const metrics = await page.evaluate(() => {
    // LCP
    const lcpEntry = performance.getEntriesByName('largest-contentful-paint')[0];
    let lcp = null, lcpTag = null, lcpSrc = null;
    if (lcpEntry) {
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
    // TBT
    const longTasks = performance.getEntriesByType('longtask');
    let tbt = 0;
    longTasks.forEach(t => {
      const d = t.duration;
      if (d > 50) tbt += d - 50;
    });
    return { lcp, lcpTag, lcpSrc, cls, tbt };
  });
  const fs = require('fs');
  fs.writeFileSync('performance_before.json', JSON.stringify(metrics, null, 2));
  await browser.close();
})();
