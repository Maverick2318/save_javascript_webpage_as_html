const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')

// Get the CLI args and strip off the first two elements. See: https://nodejs.org/en/knowledge/command-line/how-to-parse-command-line-arguments/
var cliArgs = process.argv.slice(2)

if (cliArgs.length != 1) {
  var cliName = path.basename(__filename)
  console.log("Usage: " + cliName + " <full_path_to_jstack>")
  process.exit(1)
}

var jstackFilePath = cliArgs[0]
try {
  if (!fs.existsSync(jstackFilePath)) {
    console.log("No such file: " + jstackFilePath)
    process.exit(2)
  }
} catch (err) {
  console.error(err)
  processs.exit(3)
}

(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('file:///Users/nsiddiq/jstack-review/index.html')

  // get the selector input type=file (for upload file)
  await page.waitForSelector('input[type=file]')
  await page.waitFor(1000)

  // get the ElementHandle of the selector above
  const inputUploadHandle = await page.$('input[type=file]')

  // Sets the value of the file input
  inputUploadHandle.uploadFile(jstackFilePath)

  // wait for selector that contains the uploaded file URL
  await page.waitForSelector('#tda_1_dumpFile')
  await page.waitFor(1000)

  // This block will make Puppeteer press jstack-review's 'End tour' button for me.
  const [button] = await page.$x("//button[contains(., 'End tour')]")
  if (button) {
    await button.click()
  }

  const html = await page.content()
  fs.writeFileSync("jstack.html", html)

  await browser.close()
})()
