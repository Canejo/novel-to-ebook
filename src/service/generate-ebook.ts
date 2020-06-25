import { WebPageEntity } from "../extractors/generic/webpage.entity";
import { Config } from "../config";
import { resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';
const kindlegen = require('./../config/kindlegen');
const Epub = require('epub-gen');

export class GenerateEbook {

    async start(webPage: WebPageEntity) {
        const pathEpub = resolve(Config.path, `${webPage.title}.epub`);
        const pathMobi = resolve(Config.path, `${webPage.title}.mobi`);

        const option = {
            title: webPage.title,
            author: 'Novel-to-Ebook',
            publisher: webPage.url,
            content: webPage.articles.map(m => ({
                title: m.title,
                data: this.removeImg(m.content),
            })),
        };

        await new Epub(option, pathEpub).promise;

        await new Promise(async (resolve, reject) => {
            kindlegen(readFileSync(pathEpub), (error: any, mobi: any) => {
                if (error) reject(error);

                writeFileSync(pathMobi, mobi);

                resolve(pathMobi);
            });
        });
 
    }

    removeImg(content: string): string {
        return content.replace(/<img.*>/gi, '\n');
    }
}