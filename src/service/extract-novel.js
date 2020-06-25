const puppeteer = require('puppeteer');
const winston = require('../config/winston');

async function extract({ url } = settings) {
    const browser = await puppeteer.launch({
        headless: true
    });
    try {
        winston.info('[extract-novel] > Navigating to url');
        const page = await browser.newPage();
        await page.goto(url, {waitUntil: 'networkidle2'});
        
    } catch(e) {
        throw e;
    } finally {
        await browser.close();    
    }
}


module.exports = {
    extract
};