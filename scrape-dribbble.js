const { chromium } = require('playwright');

const SEARCHES = [
  { q: 'gamification reward mobile UI', tag: '游戏化' },
  { q: 'e-commerce promotion campaign', tag: '电商大促' },
  { q: 'membership VIP subscription', tag: '会员体系' },
  { q: 'app activity page chinese UI', tag: '活动页面' },
  { q: 'sign in daily reward app', tag: '签到活动' },
  { q: 'app monetization paywall', tag: '订阅付费' },
  { q: 'social referral invite reward mobile app', tag: '社交裂变' },
  { q: 'interactive marketing campaign mobile', tag: '互动营销' },
];

// All existing image URLs to deduplicate
const EXISTING_IMGS = new Set([
  'https://cdn.dribbble.com/userupload/17839227/file/original-00a57e86e88d572e4087d489a68bb6cf.jpg',
  'https://cdn.dribbble.com/userupload/46367811/file/c693173e7195cde2f3b9fd534a0fb7b2.jpg',
  'https://cdn.dribbble.com/userupload/46072897/file/881320c42e24c817236fffd8ffa81cdc.png',
  'https://cdn.dribbble.com/userupload/45920986/file/a00cc0a3e19a978e5dee8081a2ef241c.jpg',
  'https://cdn.dribbble.com/userupload/44970004/file/ba9a2cf44763fcdd3a0aee69d8bf0150.jpg',
  'https://cdn.dribbble.com/userupload/46559693/file/9766dd84252d30ffe63851f6c626fc73.png',
  'https://cdn.dribbble.com/userupload/44456559/file/a35389a21dd7da57e06bb33ad50f0b37.png',
  'https://cdn.dribbble.com/userupload/44639256/file/7b56ca14f7ac3aeb25dfa789c5b11cee.png',
  'https://cdn.dribbble.com/userupload/46670487/file/7489823be07c288720d32b7ed5988b09.png',
  'https://cdn.dribbble.com/userupload/44937929/file/97da233ca544fe1b385fa819f93ef732.jpg',
  'https://cdn.dribbble.com/userupload/42994448/file/original-fc43f59518260f579d5d3c8cd4d23ee9.jpg',
  'https://cdn.dribbble.com/userupload/46363939/file/711b5ba691c1b44acd1e8c4888e3218d.jpg',
  'https://cdn.dribbble.com/userupload/44935740/file/4c73d6918f12aa28b0e311feff834af7.png',
  'https://cdn.dribbble.com/userupload/18019795/file/original-750cce4eb6620bca83694d5a89dcfb59.jpg',
  'https://cdn.dribbble.com/userupload/46593340/file/a1c6b70d56042d9381efbb54ca998972.png',
  'https://cdn.dribbble.com/userupload/45001249/file/5e09cda05c0ff6b193d854a84fda21ab.png',
  'https://cdn.dribbble.com/userupload/46494450/file/ea3c3034e2158314e9d6b2ac471d5106.jpg',
  'https://cdn.dribbble.com/userupload/45691251/file/58fcc7d3b68a35d7208fe64e8fab87a4.jpg',
  'https://cdn.dribbble.com/userupload/46164117/file/4d4412b0fb45c182ded5837346f5434b.jpg',
  'https://cdn.dribbble.com/userupload/46367811/file/c693173e7195cde2f3b9fd534a0fb7b2.jpg',
  'https://cdn.dribbble.com/userupload/47076870/file/fae6c241c1bedbe4ea1fb2f224f43a1c.png',
  'https://cdn.dribbble.com/userupload/47001823/file/e548ed3587db39818fa2fbf817bdaf6b.png',
  'https://cdn.dribbble.com/userupload/46817440/file/1576c31bd5efd2024f3941dce49c7932.jpg',
  'https://cdn.dribbble.com/userupload/46572223/file/a95a8d1b263fa0b7637f40ed55ecd55d.jpg',
  'https://cdn.dribbble.com/userupload/43021175/file/original-dcc191c205392b78e0aa916e23d50046.png',
]);

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 }
  });
  
  const allResults = [];
  const seenUrls = new Set(EXISTING_IMGS);

  for (const search of SEARCHES) {
    if (allResults.length >= 5) break;
    
    const page = await context.newPage();
    const url = `https://dribbble.com/search/shots/popular/mobile?q=${encodeURIComponent(search.q)}`;
    
    try {
      console.error(`Searching: ${search.q}`);
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(3000);
      
      // Scroll down to load more images
      await page.evaluate(() => window.scrollBy(0, 1500));
      await page.waitForTimeout(2000);
      
      // Extract image URLs from shot thumbnails
      const images = await page.evaluate(() => {
        const results = [];
        const imgElements = document.querySelectorAll('img[src*="cdn.dribbble.com/userupload/"], img[data-src*="cdn.dribbble.com/userupload/"]');
        
        for (const img of imgElements) {
          let src = img.src || img.dataset.src || '';
          if (src.includes('cdn.dribbble.com/userupload/') && src.includes('/file/')) {
            src = src.split('?')[0];
            // Skip tiny avatars
            const width = img.naturalWidth || img.width || 0;
            if (width > 0 && width < 80) continue;
            
            // Get shot title from parent elements
            let title = '';
            const card = img.closest('[class*="shot"]') || img.closest('li') || img.closest('a');
            if (card) {
              const titleEl = card.querySelector('[class*="title"], [class*="name"]');
              if (titleEl) title = titleEl.textContent.trim();
            }
            if (!title) title = img.alt || '';
            
            // Get link to shot
            let pin = '';
            const link = img.closest('a[href*="/shots/"]');
            if (link) pin = link.href;
            
            results.push({ src, title, pin });
          }
        }
        return results;
      });
      
      console.error(`Found ${images.length} images for "${search.q}"`);
      
      for (const img of images) {
        if (seenUrls.has(img.src)) continue;
        if (allResults.length >= 5) break;
        
        seenUrls.add(img.src);
        allResults.push({
          img: img.src,
          title: img.title,
          pin: img.pin,
          tag: search.tag,
          query: search.q
        });
      }
    } catch (err) {
      console.error(`Error for "${search.q}": ${err.message}`);
    } finally {
      await page.close();
    }
  }
  
  // Output results
  const fs = require('fs');
  fs.writeFileSync('scraped-results.json', JSON.stringify(allResults, null, 2));
  console.error(`Total new images found: ${allResults.length}`);
  console.error('Results saved to scraped-results.json');
  
  await browser.close();
})();
