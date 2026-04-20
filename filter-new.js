const fs = require('fs');

// Existing image URLs from compete.html CASES
const existingImgs = new Set([
  "https://cdn.dribbble.com/userupload/46559693/file/9766dd84252d30ffe63851f6c626fc73.png",
  "https://cdn.dribbble.com/userupload/44935740/file/4c73d6918f12aa28b0e311feff834af7.png",
  "https://cdn.dribbble.com/userupload/47076870/file/fae6c241c1bedbe4ea1fb2f224f43a1c.png",
  "https://cdn.dribbble.com/userupload/46072897/file/881320c42e24c817236fffd8ffa81cdc.png",
  "https://cdn.dribbble.com/userupload/46670487/file/7489823be07c288720d32b7ed5988b09.png",
  "https://cdn.dribbble.com/userupload/45920986/file/a00cc0a3e19a978e5dee8081a2ef241c.jpg",
  "https://cdn.dribbble.com/userupload/44456559/file/a35389a21dd7da57e06bb33ad50f0b37.png",
  "https://cdn.dribbble.com/userupload/46367811/file/c693173e7195cde2f3b9fd534a0fb7b2.jpg",
  "https://cdn.dribbble.com/userupload/17839227/file/original-00a57e86e88d572e4087d489a68bb6cf.jpg",
  "https://cdn.dribbble.com/userupload/44970004/file/ba9a2cf44763fcdd3a0aee69d8bf0150.jpg",
  "https://cdn.dribbble.com/userupload/44639256/file/7b56ca14f7ac3aeb25dfa789c5b11cee.png",
  "https://cdn.dribbble.com/userupload/44937929/file/97da233ca544fe1b385fa819f93ef732.jpg",
  "https://cdn.dribbble.com/userupload/42994448/file/original-fc43f59518260f579d5d3c8cd4d23ee9.jpg",
  "https://cdn.dribbble.com/userupload/46363939/file/711b5ba691c1b44acd1e8c4888e3218d.jpg",
  "https://cdn.dribbble.com/userupload/46593340/file/a1c6b70d56042d9381efbb54ca998972.png",
  "https://cdn.dribbble.com/userupload/45001249/file/5e09cda05c0ff6b193d854a84fda21ab.png",
  "https://cdn.dribbble.com/userupload/46494450/file/ea3c3034e2158314e9d6b2ac471d5106.jpg",
  "https://cdn.dribbble.com/userupload/45691251/file/58fcc7d3b68a35d7208fe64e8fab87a4.jpg",
  "https://cdn.dribbble.com/userupload/46164117/file/4d4412b0fb45c182ded5837346f5434b.jpg",
  "https://cdn.dribbble.com/userupload/18019795/file/original-750cce4eb6620bca83694d5a89dcfb59.jpg",
  "https://cdn.dribbble.com/userupload/46939179/file/81496f52a1fafbdfef3454bbe673372e.png",
  "https://cdn.dribbble.com/userupload/47061618/file/b36960abb97809699e8c998ba370a512.png",
  "https://cdn.dribbble.com/userupload/14454126/file/original-763734d6fcf75f5040964dff5ecca7cd.png",
  "https://cdn.dribbble.com/userupload/46985382/file/still-e4f93313bb455d48c263234d95c0bba9.gif",
  "https://cdn.dribbble.com/userupload/43349020/file/original-87c68d8e82e51d02a9cc42f666e0dabf.png",
  "https://cdn.dribbble.com/userupload/46908178/file/960744c0b6c244ce6ec0f3992055c9d9.jpg",
  "https://cdn.dribbble.com/userupload/46930116/file/b202606132006e1847352a6c13cb85ca.png",
  "https://cdn.dribbble.com/userupload/46202972/file/still-f444504393d387104630b1a3fbdf1fab.png",
  "https://cdn.dribbble.com/userupload/46524518/file/87b42d8a7e84a1678127ba080b5a9eeb.jpg",
  "https://cdn.dribbble.com/userupload/24363235/file/original-771425c20e3d27c3c27a935cf92fc0b8.png",
  "https://cdn.dribbble.com/userupload/47232659/file/f6e3fb86ee19239b25b1b5fd66f1b5a0.png",
  "https://cdn.dribbble.com/userupload/47367741/file/still-c6ac20cd40b2ceada3fc28be42baae11.png",
  "https://cdn.dribbble.com/userupload/45128041/file/61135acde0e70c76dad74d1c9f616dfa.png",
  "https://cdn.dribbble.com/userupload/46173049/file/d21a905c3a7ee50fdbbb06ad2043b119.png",
  "https://cdn.dribbble.com/userupload/43021175/file/original-dcc191c205392b78e0aa916e23d50046.png",
  "https://cdn.dribbble.com/userupload/47001823/file/e548ed3587db39818fa2fbf817bdaf6b.png",
  "https://cdn.dribbble.com/userupload/46817440/file/1576c31bd5efd2024f3941dce49c7932.jpg",
  "https://cdn.dribbble.com/userupload/46572223/file/a95a8d1b263fa0b7637f40ed55ecd55d.jpg",
]);

const scraped = JSON.parse(fs.readFileSync('scraped-new.json', 'utf-8'));
const newOnes = scraped.filter(r => !existingImgs.has(r.img));

console.log(`New (not in existing): ${newOnes.length}`);

// Group by keyword  
const byKw = {};
for (const r of newOnes) {
  if (!byKw[r.keyword]) byKw[r.keyword] = [];
  byKw[r.keyword].push(r.img);
}
for (const [kw, imgs] of Object.entries(byKw)) {
  console.log(`\n[${kw}] ${imgs.length} new images:`);
  imgs.slice(0, 3).forEach(u => console.log(`  ${u}`));
}
