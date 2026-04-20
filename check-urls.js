const https = require('https');
const http = require('http');

const urls = [
  'https://cdn.dribbble.com/userupload/46939179/file/81496f52a1fafbdfef3454bbe673372e.png',
  'https://cdn.dribbble.com/userupload/47061618/file/b36960abb97809699e8c998ba370a512.png',
  'https://cdn.dribbble.com/userupload/14454126/file/original-763734d6fcf75f5040964dff5ecca7cd.png',
  'https://cdn.dribbble.com/userupload/45307917/file/77d5a864c175255b2a03d25d02344318.webp',
  'https://cdn.dribbble.com/userupload/45784487/file/53bc9895bab5ebe12b0b266898f9fca8.png',
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.request(url, { method: 'HEAD', timeout: 10000 }, (res) => {
      const ct = res.headers['content-type'] || '';
      resolve({ url: url.split('/').pop(), status: res.statusCode, type: ct, ok: res.statusCode >= 200 && res.statusCode < 400 });
    });
    req.on('error', (e) => resolve({ url: url.split('/').pop(), status: 'ERROR', type: e.message, ok: false }));
    req.on('timeout', () => { req.destroy(); resolve({ url: url.split('/').pop(), status: 'TIMEOUT', type: '', ok: false }); });
    req.end();
  });
}

(async () => {
  for (const url of urls) {
    const r = await checkUrl(url);
    console.log(`${r.ok ? 'OK' : 'FAIL'} [${r.status}] ${r.url} (${r.type})`);
  }
})();
