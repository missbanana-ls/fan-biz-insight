const https = require('https');
const http = require('http');

const candidates = [
  { keyword: 'gamification reward mobile UI', img: 'https://cdn.dribbble.com/userupload/47238488/file/1b6cfa13e8e8532ee59662423612bcca.png' },
  { keyword: 'gamification reward mobile UI', img: 'https://cdn.dribbble.com/userupload/45784487/file/53bc9895bab5ebe12b0b266898f9fca8.png' },
  { keyword: 'e-commerce promotion campaign', img: 'https://cdn.dribbble.com/userupload/45039955/file/b0052e2e87a41ab33873e9e41b4fa072.jpg' },
  { keyword: 'e-commerce promotion campaign', img: 'https://cdn.dribbble.com/userupload/44962034/file/8b3f0665c7fa54efa699f084d251f650.jpg' },
  { keyword: 'e-commerce promotion campaign', img: 'https://cdn.dribbble.com/userupload/45978250/file/ca880167c3069a7031c332ef22c4a66e.png' },
  { keyword: 'membership VIP subscription', img: 'https://cdn.dribbble.com/userupload/18299042/file/original-5109c703b5d01fb1a4c8d02e036d0fcb.jpg' },
  { keyword: 'membership VIP subscription', img: 'https://cdn.dribbble.com/userupload/25912629/file/original-9f2a22bab2e1ca52707103a4798e90da.png' },
  { keyword: 'membership VIP subscription', img: 'https://cdn.dribbble.com/userupload/44245055/file/ec71d874ed681546b226534422961ff3.png' },
  { keyword: 'sign in daily reward app', img: 'https://cdn.dribbble.com/userupload/12312426/file/original-aa72b1753cb4625aca323204e79dfc72.png' },
  { keyword: 'sign in daily reward app', img: 'https://cdn.dribbble.com/userupload/47265762/file/6d561479efec0babaa21bab759d6e841.png' },
  { keyword: 'app monetization paywall', img: 'https://cdn.dribbble.com/userupload/45094132/file/3abaa92bf50bf2d2eb26da737f0bd021.jpg' },
  { keyword: 'app monetization paywall', img: 'https://cdn.dribbble.com/userupload/46079691/file/1bda97b2ca17aa1ac3169a92f5e45816.jpg' },
  { keyword: 'app activity page chinese UI', img: 'https://cdn.dribbble.com/userupload/47316472/file/4a63694f5947811c8f567391ede9f169.png' },
  { keyword: 'app activity page chinese UI', img: 'https://cdn.dribbble.com/userupload/46228313/file/still-c1b3125cd29d1822da9dfefa35704ced.png' },
  { keyword: 'e-commerce promotion campaign', img: 'https://cdn.dribbble.com/userupload/47013658/file/74419b4761a7e4555327262ab2eb7037.png' },
  { keyword: 'app monetization paywall', img: 'https://cdn.dribbble.com/userupload/46771740/file/still-41bfb06252e6f2596df52b4b82bbc594.png' },
];

function checkUrl(url) {
  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, { timeout: 10000 }, (res) => {
      const ct = res.headers['content-type'] || '';
      const len = parseInt(res.headers['content-length'] || '0', 10);
      resolve({ url, status: res.statusCode, type: ct, size: len });
      res.destroy();
    });
    req.on('error', (e) => resolve({ url, status: 0, error: e.message }));
    req.on('timeout', () => { req.destroy(); resolve({ url, status: 0, error: 'timeout' }); });
  });
}

(async () => {
  const results = await Promise.all(candidates.map(c => checkUrl(c.img)));
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    const ok = r.status === 200 && r.size > 5000;
    console.log(`${ok ? 'OK' : 'FAIL'} [${candidates[i].keyword}] ${r.status} size=${r.size} ${r.url.split('/').pop()}`);
  }
})();
