const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Test at multiple viewport widths
  const viewports = [
    { width: 320, height: 667, name: 'iPhone SE (320px)' },
    { width: 375, height: 667, name: 'iPhone 8/SE2 (375px)' },
    { width: 390, height: 844, name: 'iPhone 12/13/14 (390px)' },
    { width: 414, height: 896, name: 'iPhone 11 Pro Max (414px)' },
    { width: 768, height: 1024, name: 'iPad (768px)' },
  ];
  
  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000); // Wait for animations
    
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const innerWidth = await page.evaluate(() => window.innerWidth);
    const hasHorizontalScroll = scrollWidth > innerWidth;
    
    console.log(`${vp.name}: innerWidth=${innerWidth}, scrollWidth=${scrollWidth}, horizontalScroll=${hasHorizontalScroll ? 'YES ❌' : 'NO ✓'}`);
    
    if (hasHorizontalScroll) {
      // Find overflowing element
      const overflow = await page.evaluate(() => {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
        const results = [];
        while (walker.nextNode()) {
          const el = walker.currentNode;
          const rect = el.getBoundingClientRect();
          if (rect.right > window.innerWidth || rect.left < 0) {
            results.push({
              tag: el.tagName,
              class: el.className,
              id: el.id,
              rect: { left: rect.left, right: rect.right, width: rect.width }
            });
          }
        }
        return results;
      });
      console.log('  Overflowing elements:', overflow);
    }
  }
  
  await browser.close();
})();