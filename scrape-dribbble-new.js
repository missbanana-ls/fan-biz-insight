const { chromium } = require('playwright');

const KEYWORDS = [
  'gamification reward mobile UI',
  'e-commerce promotion campaign',
  'membership VIP subscription',
  'app activity page chinese UI',
  'sign in daily reward app',
  'app monetization paywall'
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const allResults = [];

  for (const keyword of KEYWORDS) {
    const page = await context.newPage();
    const q = encodeURIComponent(keyword);
    const url = `https://dribbble.com/search/shots/popular/mobile?q=${q}`;
    
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2000);
      
      // Scroll to load more
      for (let i = 0; i < 3; i++) {
        await page.mouse.wheel(0, 2000);
        await page.waitForTimeout(1000);
      }

      const imgs = await page.evaluate(() => {
        const results = [];
        const imgElements = document.querySelectorAll('img');
        for (const img of imgElements) {
          const src = img.src || '';
          if (src.includes('cdn.dribbble.com/userupload') && src.includes('/file/')) {
            const cleanUrl = src.split('?')[0];
            if (!results.includes(cleanUrl)) {
              results.push(cleanUrl);
            }
          }
        }
        return results;
      });

      console.log(`[${keyword}] Found ${imgs.length} images`);
      for (const imgUrl of imgs) {
        allResults.push({ keyword, img: imgUrl });
      }
    } catch (e) {
      console.log(`[${keyword}] Error: ${e.message}`);
    }
    await page.close();
  }

  await browser.close();

  // Deduplicate by img URL
  const seen = new Set();
  const unique = [];
  for (const r of allResults) {
    if (!seen.has(r.img)) {
      seen.add(r.img);
      unique.push(r);
    }
  }

  const fs = require('fs');
  fs.writeFileSync('scraped-new.json', JSON.stringify(unique, null, 2));
  console.log(`\nTotal unique images: ${unique.length}`);
  console.log('Saved to scraped-new.json');
})();
