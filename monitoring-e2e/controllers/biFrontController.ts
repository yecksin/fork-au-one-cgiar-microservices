import puppeteer from 'puppeteer';
// import { sendSlackNotification } from '../classes/slack';
import logger from '../classes/logs';
import { Site } from './cronController';
import { error } from 'winston';

const evaluateUrl = async (url: string, site: Site) => {
  return new Promise(async (resolve, reject) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url);

    let works = null;
    const { html_tag_attribute_value } = site;
    try {
      await page.waitForSelector('.' + html_tag_attribute_value).catch(error => {
        logger.error(`Error Embedding: ${error}`, { error: 'from waitForSelector' });
        resolve({
          works: false,
          message: 'Error in the web scraping process.',
          url
        });
      });
      works = await page
        .evaluate(html_tag_attribute_value => {
          const element = document.querySelector('.' + html_tag_attribute_value);
          return (element ? element.getAttribute('works') : null) ? true : false;
        }, html_tag_attribute_value)
        .catch(error => {
          return false;
        });

      await browser.close();
    } catch (error) {
      logger.error(`Error Embedding: ${error}`, { error: 'from try catch' });
      await browser.close();
    }

    if (works) {
      logger.info('Embedding generated successfully.', site);
    } else {
      logger.error(`Error Embedding: ${error}`, { error: 'from try catch' });
    }

    resolve({
      works,
      message: works ? 'Embedding generated successfully.' : 'Error in the web scraping process.',
      url
    });
  });
};

export { evaluateUrl };
