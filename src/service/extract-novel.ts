import * as puppeteer from 'puppeteer';
import { Extractors } from '../extractors';
import { WebPageEntity } from '../extractors/generic/webpage.entity';
import { CacheService } from './cache-service';
const winston = require('../config/winston');

export class ExtractNovel {
    async start(url: string, force: boolean): Promise<WebPageEntity> {
        let webPage: WebPageEntity;

        if (CacheService.exists(url) && !force) {
            winston.info('[extract-novel] > Get novel from cache');
            webPage =  CacheService.get<WebPageEntity>(url);
        } else {
            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                headless: true
            });
            try {
                winston.info('[extract-novel] > Configure to extract novel');
                const page = await browser.newPage();
                webPage = await Extractors.getNovel(url, page);
                CacheService.set(url, webPage);
            } catch(e) {
                throw e;
            } finally {
                await browser.close();    
            }
        }
        winston.info(`[extract-novel] > ${webPage.title} with ${webPage.firstChapter}~${webPage.lastChapter} chapters`);
        return webPage;
    }
}