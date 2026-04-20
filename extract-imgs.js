async page => {
  for (let i = 0; i < 3; i++) {
    await page.mouse.wheel(0, 2000);
    await page.waitForTimeout(1000);
  }
  const urls = await page.evaluate(() => {
    const imgs = document.querySelectorAll('img');
    const results = [];
    for (const img of imgs) {
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
  return JSON.stringify(urls);
}
