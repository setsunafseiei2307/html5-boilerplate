import { chromium } from 'playwright';

const BASE = process.env.BASE ?? 'http://localhost:5173';
const OUT = process.env.OUT ?? '/tmp/claude-0/-home-user-html5-boilerplate/252ceec5-d17c-5ecb-9d37-a4d7186ba6d9/scratchpad/shots';
const ROUND = process.env.ROUND ?? '1';

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });

async function shoot(name, { width, height = 900, theme = 'light', full = true, steps }) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 2,
    colorScheme: theme,
    locale: 'ja-JP'
  });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  if (steps) await steps(page);
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/r${ROUND}-${name}.png`, fullPage: full });
  await context.close();
  console.log('shot', name);
}

const gotoResult = async (page) => {
  await page.goto(`${BASE}/#/calc?o=wedding&r=friend&a=30s&g=kanto&t=attend&v=1`, { waitUntil: 'networkidle' });
};

await shoot('top-375', { width: 375 });
await shoot('top-1280', { width: 1280 });
await shoot('form-mid-375', { width: 375, steps: async (page) => {
  await page.goto(`${BASE}/#/calc`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /結婚祝い/ }).click();
  await page.getByRole('button', { name: /次へ/ }).click();
  await page.waitForTimeout(300);
}});
await shoot('form-mid-1280', { width: 1280, steps: async (page) => {
  await page.goto(`${BASE}/#/calc`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /葬儀・法要/ }).click();
  await page.getByRole('button', { name: /次へ/ }).click();
  await page.waitForTimeout(300);
}});
await shoot('error-375', { width: 375, steps: async (page) => {
  await page.goto(`${BASE}/#/calc`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /次へ/ }).click();
  await page.waitForTimeout(600);
}});
await shoot('error-1280', { width: 1280, steps: async (page) => {
  await page.goto(`${BASE}/#/calc`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /次へ/ }).click();
  await page.waitForTimeout(600);
}});
await shoot('result-375', { width: 375, steps: gotoResult });
await shoot('result-1280', { width: 1280, steps: gotoResult });
await shoot('result-dark-1280', { width: 1280, theme: 'dark', steps: gotoResult });
await shoot('result-dark-375', { width: 375, theme: 'dark', steps: gotoResult });
await shoot('funeral-result-1280', { width: 1280, steps: async (page) => {
  await page.goto(`${BASE}/#/calc?o=funeral&r=colleague&a=40s&g=national&t=attend&v=1`, { waitUntil: 'networkidle' });
}});
await shoot('quiz-1280', { width: 1280, steps: async (page) => {
  await page.goto(`${BASE}/#/quiz`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /御霊前/ }).click();
  await page.waitForTimeout(400);
}});
await shoot('quiz-375', { width: 375, steps: async (page) => {
  await page.goto(`${BASE}/#/quiz`, { waitUntil: 'networkidle' });
}});
await shoot('quizresult-1280', { width: 1280, steps: async (page) => {
  await page.goto(`${BASE}/#/quiz/r?s=vz`, { waitUntil: 'networkidle' });
}});
await shoot('quizresult-375', { width: 375, steps: async (page) => {
  await page.goto(`${BASE}/#/quiz/r?s=vz`, { waitUntil: 'networkidle' });
}});
await shoot('guide-1280', { width: 1280, steps: async (page) => {
  await page.goto(`${BASE}/#/guide`, { waitUntil: 'networkidle' });
}});
await shoot('empty-dark-375', { width: 375, theme: 'dark' });

await browser.close();
