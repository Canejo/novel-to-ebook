import * as cheerio from 'cheerio';
import { IWebSiteCustom } from "./custom/web-site.custom";
import { BabelnovelComExtractor } from "./custom/babelnovel.com";
import { GravitytalesCom } from "./custom/gravitytales.com";
import { LnmtlComExtractor } from "./custom/lnmtl.com";
import { NovelmaniaComBrExtractor } from "./custom/novelmania.com.br";
import { PastebinCom } from "./custom/pastebin.com";
import { SaikaiscanComBrExtractor } from "./custom/saikaiscan.com.br";
import { WwwWebnovelCom } from "./custom/www.webnovel.com";
import { WwwWuxiaworldComExtractor } from "./custom/www.wuxiaworld.com";
import { Page } from "puppeteer";
import { WebPageEntity } from "./generic/webpage.entity";
import { IWebSiteJson } from "./custom/web-site.json";
import { ArticleEntity } from "./generic/article.entity";
const winston = require('../config/winston');

export class Extractors {
    private static list: Array<IWebSiteCustom> = [
        BabelnovelComExtractor,
        GravitytalesCom,
        LnmtlComExtractor,
        NovelmaniaComBrExtractor,
        PastebinCom,
        SaikaiscanComBrExtractor,
        WwwWebnovelCom,
        WwwWuxiaworldComExtractor,
    ];

    private static get(url: string): IWebSiteCustom | undefined {
        const parse = this.getHostUrl(url);
        const hostname = parse.replace('http://', '').replace('https://', '');
        return this.list.find((webSite: IWebSiteCustom) =>  {
            if (typeof webSite.domain !== 'string') {
                return webSite.domain.indexOf(hostname) > -1;
            } else {
                return webSite.domain === hostname;
            }
        });
    }

    static async getNovel(url: string, page: Page): Promise<WebPageEntity> {
        const extractor = this.get(url);
        const webPageEntity = new WebPageEntity();
        if (extractor) {
            winston.info('> [extractor] Navigating to url');

            await page.goto(url, {waitUntil: 'networkidle2'});
            const html = await page.content();
            const $ = cheerio.load(html);

            webPageEntity.url = url;
            if (this.isWebSiteJson(extractor)) {
                const webSiteJson: IWebSiteJson = extractor as IWebSiteJson;
                webPageEntity.title = webSiteJson.getTitle(html);
                webPageEntity.articles = webSiteJson.getArticles(html);
            } else {
                if (extractor.puppeteer) {

                } else {
                    webPageEntity.title = $(extractor.title.selectors).text();
                    winston.info('> [extractor] Geting articles');
                    webPageEntity.articles = this.getArticles(url, extractor, $);
                }
            }
            
        } else {
            return Promise.reject('Extractor not configure.');
        }

        if (webPageEntity && webPageEntity.articles && webPageEntity.articles.length > 1) {
            webPageEntity.articleCount = webPageEntity.articles.length;
            webPageEntity.firstChapter = webPageEntity.articles[0].chapter;
            webPageEntity.lastChapter = webPageEntity.articles[webPageEntity.articleCount - 1].chapter;

        }

        return webPageEntity;
    }

    static getArticles(url: string, extractor: IWebSiteCustom, $: any): ArticleEntity[] {
        const linkAvailable: ArticleEntity[] = [];

        const elements = $(extractor.articles.selectors);
        for (let i = 0; i < elements.length; i++) {
            const $el = $(elements[i]);
            const href = $el.attr('href');
            const text = $el.text();
            const article = this.convertArticle(url, extractor, {url: href, text });
            if (article) {
                linkAvailable.push(article);
            }
        }

        return linkAvailable;
    }

    private static convertArticle(url: string, extractor: IWebSiteCustom, article: { url: string, text: string }): ArticleEntity {
        let articleEntity: ArticleEntity;
        if (!(!article.url || article.url[0] === '#' || article.url === '/' || article.url.indexOf('javascript:') > -1)) {
            if (article.url[0] === '/') {
                article.url = `${this.getHostUrl(url)}${article.url}`;
            }
            const chapter = extractor.getChapter(article.url, article.text);
            if (chapter > -1 ) {
                articleEntity = {
                    title: article.text,
                    url: article.url,
                    chapter
                };
            }
        }
        return articleEntity;
    }

    private static getHostUrl(url: string): string {
        const uri = new URL(url);
        return uri.origin;
    }

    private static isWebSiteJson(object: any): object is IWebSiteJson {
        return 'getArticles' in object;
    }
}