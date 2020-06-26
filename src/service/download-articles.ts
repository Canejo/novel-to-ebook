import * as Mercury from '@postlight/mercury-parser';
import * as puppeteer from 'puppeteer';

import { WebPageEntity } from "../extractors/generic/webpage.entity";
import { ArticleEntity } from "../extractors/generic/article.entity";
import { existsSync } from 'fs';
import { GenerateEbook } from './generate-ebook';
const winston = require('../config/winston');

export class DownloadArticles {

    async start(args: { webPage: WebPageEntity;url: string; force: boolean; count: number }): Promise<WebPageEntity> {
        const { webPage, force, count } = args;
        const { articles } = webPage;
        const generateEbook = new GenerateEbook();

        const chuncks = this.chunkArray(articles, count);

        for (const chk of chuncks) {
            webPage.articles = chk;
            
            if (!existsSync(generateEbook.mobiPath(webPage))) {
                winston.info(`> [download-articles] Extracting articles ${chk[0].chapter} ~ ${chk[chk.length - 1].chapter}`);
                webPage.articles = await this.downloadAll(chk);
                await generateEbook.start(webPage);
            }
        }

        return webPage;
    }

    private chunkArray(a: any[], chunkSize: number) {
        var R = [];
        for (var i = 0; i < a.length; i += chunkSize)
        R.push(a.slice(i, i + chunkSize));
        return R;
    }

    async downloadAll(articles: ArticleEntity[]): Promise<ArticleEntity[]> {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: true
        });
        try {
            const page = await browser.newPage();
            let index = 0;
            for (const article of articles) {
                winston.info(`> [download-articles] [${index+1}/${articles.length}] download content`);

                if (article.url) {
                    try {
                        await page.goto(article.url, {waitUntil: 'networkidle2'});
                        const html = await page.content();
                        const result = await Mercury.parse(article.url, {
                            html
                        });
                        article.content = result.content;
                    } catch (e) {
                        winston.error(`> [download-articles] Erro get html from ${article.url}`);
                        throw e;
                    }
                }

                if (!article.content) {
                    winston.warn(`> [download-articles] Article ${article.chapter} wihout content`);
                }
                index++;
            }
        
        } catch (e) {
            throw e;
        } finally {
            await browser.close();
        }
        return articles;
    }
}