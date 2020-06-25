import * as Mercury from '@postlight/mercury-parser';

import { WebPageEntity } from "../extractors/generic/webpage.entity";
import { ArticleEntity } from "../extractors/generic/article.entity";
const winston = require('../config/winston');

export class DownloadArticles {

    async start(args: { webPage: WebPageEntity; chapterArray: number[]; url: string; chapters: string; }): Promise<WebPageEntity> {
        const { webPage, chapterArray, chapters } = args;
        const { articles } = webPage;

        let articlesToDownload:ArticleEntity[] = [];
        if (articles && articles.length > 0) {
            
            if (chapterArray && chapterArray.length > 0) {
                articlesToDownload = articles.filter(m => chapterArray.indexOf(m.chapter) > -1);
            } else if (chapters !== 'all') {
                const itens = chapters.split('~');
                articlesToDownload = articles.filter(m => m.chapter >= parseInt(itens[0]) && m.chapter <= parseInt(itens[1]));
            } else {
                articlesToDownload = articles;
            }

            winston.info(`[download-articles] > Extracting articles ${articlesToDownload[0].chapter} ~ ${articlesToDownload[articlesToDownload.length - 1].chapter}`);
            articlesToDownload = await this.downloadAll(articlesToDownload);
            webPage.articles = articlesToDownload;
        } else {
            return Promise.reject('Articles not found.');
        }
        return webPage;
    }

    async downloadAll(articlesToDownload: ArticleEntity[]): Promise<ArticleEntity[]> {
        for (const article of articlesToDownload) {
            const result = await Mercury.parse(article.url);
            article.content = result.content;
        }
        return articlesToDownload;
    }
}