const puppeteer = require('puppeteer');
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('file:///Users/nsiddiq/jstack-review/index.html?https://gist.github.com/nasr4/614737e720305009a5f03c792392510a');
  await page.waitFor(1000);

  const [button] = await page.$x("//button[contains(., 'End tour')]");
  if (button) {
    await button.click();
  }

  const html = await page.content();
  fs.writeFileSync("jstack.html", html);

  await browser.close();
})();
