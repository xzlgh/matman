const matman = require('matman');
const {BrowserRunner} = require('matman-runner-puppeteer');

module.exports = async opts => {
  const page = matman.launch(new BrowserRunner(), opts);

  await page.setDeviceConfig({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36 mycustomua',
    viewport: {
      width: 1250,
      height: 400,
    },
  });

  await page.setScreenshotConfig(true);

  await page.setPageUrl('https://www.baidu.com');

  await page.addAction('init', async page => {
    await page.waitFor('#su');
  });

  const res = await page.evaluate(() => {
    return {
      title: document.title,
      width: window.innerWidth,
      height: window.innerHeight,
      userAgent: navigator.userAgent,
      _version: Date.now(),
      searchBtnTxt: document.querySelector('#su').value,
    };
  });
  return res;
};

// module
//   .exports()
//   .then(function (result) {
//     console.log(JSON.stringify(result));
//   })
//   .catch(function (error) {
//     console.error('failed:', error);
//   });
