import { WebPageEntity } from "../extractors/generic/webpage.entity";
import { Config } from "../config";
import { resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { ArticleEntity } from "../extractors/generic/article.entity";
const kindlegen = require('./../config/kindlegen');
const winston = require('./../config/winston');
const Epub = require('epub-gen');

export class GenerateEbook {

    mobiPath(webPage: WebPageEntity) {
        return resolve(Config.path, `${this.getFileName(webPage)}.mobi`);;
    }

    async start(webPage: WebPageEntity) {
        const pathEpub = resolve(Config.path, `${this.getFileName(webPage)}.epub`);
        const pathMobi = this.mobiPath(webPage);

        winston.info(`> [generate-ebook] Generanting epub...`);

        let title: string;
        if (webPage.volume && webPage.volume > 0) {
            title = `${webPage.title} - Volume ${webPage.volume}`;
            
        } else {
            title = `${webPage.title}: Chapter ${webPage.articles[0].chapter}~${webPage.articles[webPage.articles.length - 1].chapter}`;
        }
        
        const option = {
            title,
            author: 'Novel-to-Ebook',
            publisher: webPage.url,
            content: webPage.articles.filter(m => m.content).map(m => ({
                title: m.title,
                data: this.removeImg(m),
            })),
        };

        await new Epub(option, pathEpub).promise;
        
        winston.info(`> [generate-ebook] ${pathEpub}`)

        winston.info(`> [generate-ebook] Generanting Mobi...`)
        await new Promise(async (resolve, reject) => {
            kindlegen(readFileSync(pathEpub), (error: any, mobi: any) => {
                if (error) reject(error);

                writeFileSync(pathMobi, mobi);

                resolve(pathMobi);
            });
        });

        winston.info(`> [generate-ebook] ${pathMobi}`)
 
    }

    private removeImg(article: ArticleEntity): string {
        if (article && article.content) {
            article.content = article.content.replace(/<img.*>/gi, '\n');
        }
        return article.content;
    }

    private getFileName(webPage: WebPageEntity) {
        let fileName: string;
        if (webPage.volume && webPage.volume > 0) {
            fileName = `${webPage.title}-Volume-${webPage.volume}`;
        } else {
            fileName = `${webPage.title}-${webPage.articles[0].chapter}-${webPage.articles[webPage.articles.length - 1].chapter}`;
        }
      
        return fileName.replace(/\s/g, '-');
      }
}