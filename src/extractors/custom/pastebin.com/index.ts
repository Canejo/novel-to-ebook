import { IWebSiteCustom } from '../web-site.custom';

export const PastebinCom: IWebSiteCustom = {
    name: 'Pastebin',
    url: 'https://pastebin.com/',
    color: 'primary',
    domain: 'pastebin.com',
    puppeteer: false,
    articles: {
        selectors: '.maintable td:not(.td_smaller) a'
    },
    title: {
        selectors: 'h1',
    },
    getChapter: (url: string, title: string): number => {
        title = title.trim();
        let chapter = -1;
        let result = title.match(/\d+/);
        if (result) {
            chapter = +result[0];
        }
        return chapter;
    }
};
