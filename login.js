const puppeteer = require('puppeteer');

const initialUrl = process.env.login_url || 'https://connect.company.com/login';
const emailAddress = process.env.login_user || 'user@company.com';
const password = process.env.login_password || 'password';
const otp = process.env.login_otp || null;

const waitForSelectorTimeout = 2000;

async function login(url) {

  console.debug("Starting...");

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  console.debug("Blank URL: " + page.url());

  try {

    console.group("Navigating from the initial URL to the Azure login URL...");
    console.debug("Initial URL: " + url);
    let currentUrl = url;
    while (true) {
      console.debug("Current URL: " + currentUrl);
      await page.goto(currentUrl, { waitUntil: 'networkidle0' });
      const newUrl = page.url();
      if (newUrl === currentUrl) {
        console.debug("Azure login URL: " + currentUrl);
        break;
      } else {
        currentUrl = newUrl;
      }
    }
    console.groupEnd();

    console.group("Typing in the credentrials...");
    console.debug("Waiting for the e-mail address input field to appear and typing in the e-mail address: " + emailAddress);
    const emailInputSelector = 'input[name="loginfmt"]';
    await page.waitForSelector(emailInputSelector, { timeout: waitForSelectorTimeout });
    await page.type(emailInputSelector, emailAddress, { delay: 10 });
    console.debug("Waiting for the Next button to appear and clicking on it");
    const nextButtonSelector = 'input[value="Next"]';
    await page.waitForSelector(nextButtonSelector, { timeout: 1000 });
    await page.click(nextButtonSelector);
    console.debug("Waiting for the password input field to appear and typing in the password");
    const passwordInputSelector = 'input[name="passwd"]';
    await page.waitForSelector(passwordInputSelector, { timeout: 1000 });
    await page.type(passwordInputSelector, password, { delay: 10 });
    console.debug("Waiting for the Sign in button to appear and clicking on it");
    const signInButtonSelector = 'input[value="Sign in"]';
    await page.waitForSelector(signInButtonSelector, { timeout: 1000 });
    await page.click(signInButtonSelector);
    if (otp) {
      console.debug("One-time password was specified, attempting to use it");
      console.debug("Waiting for the one-time password input field to appear and typing in the otp:", otp);
      const otpInputSelector = 'input[name="otc"]';
      await page.waitForSelector(otpInputSelector, { timeout: 1000 });
      await page.type(otpInputSelector, otp, { delay: 10 });
      console.debug("Waiting for the Verify button to appear and clicking on it");
      const verifyButtonSelector = 'input[value="Verify"]';
      await page.waitForSelector(verifyButtonSelector, { timeout: 1000 });
      await page.click(verifyButtonSelector);
    }
    console.groupEnd();

    console.group("Navigating from the Azure login URL to the final URL...");
    console.debug("Current URL: " + page.url());
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    console.debug("Current URL: " + page.url());
    if (page.url().endsWith('/remote/loginconfirm')) {
      console.debug("Reached a login confirmation URL, waiting for the login confirmation link to appear and clicking on it");
      await page.waitForSelector('a[href="/remote/loginconfirm?action=login"]');
      await page.click('a[href="/remote/loginconfirm?action=login"]');
      console.debug("Current URL: " + page.url());
      await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 0 });
      console.debug("Current URL: " + page.url());
    }
    console.debug("Final URL: " + page.url());
    console.groupEnd();

    console.group("Fetching the authentication cookie named SVPNCOOKIE...");
    const cookies = await page.cookies();
    const svpnCookie = cookies.find(cookie => cookie.name === 'SVPNCOOKIE');
    console.groupEnd();

    console.error(svpnCookie.value);

  } catch (error) {
    console.info("Error:", error);
  } finally {
    await browser.close();
    console.debug("Finishing...");
  }
}

login(initialUrl);
