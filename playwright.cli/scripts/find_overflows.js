const { chromium, devices } = require('playwright');

async function findOverflowElements() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ ...devices['iPhone 13'] });
  const page = await context.newPage();

  await page.addInitScript(() => {
    localStorage.setItem('ddmai_welcome_dismissed', 'true');
  });

  await page.goto('https://vedio-working.web.app');
  await page.waitForTimeout(1000);

  const overflowInfo = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const all = document.querySelectorAll('*');
    const overflows = [];

    all.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.right > docWidth + 2) {
        overflows.push({
          tag: el.tagName,
          id: el.id,
          className: el.className.toString().substring(0, 70),
          width: Math.round(rect.width),
          right: Math.round(rect.right),
          text: (el.innerText || '').substring(0, 40).replace(/\n/g, ' ')
        });
      }
    });

    return {
      docWidth,
      scrollWidth: document.documentElement.scrollWidth,
      count: overflows.length,
      overflows: overflows.slice(0, 15)
    };
  });

  console.log('Mobile Viewport Width:', overflowInfo.docWidth);
  console.log('Total Scroll Width:', overflowInfo.scrollWidth);
  console.log('Total Overflowing Elements:', overflowInfo.count);
  console.log('Top Overflows:');
  overflowInfo.overflows.forEach((o, i) => {
    console.log(`${i+1}. <${o.tag}> id="${o.id}" class="${o.className}" width=${o.width} right=${o.right} text="${o.text}"`);
  });

  await browser.close();
}

findOverflowElements().catch(console.error);
