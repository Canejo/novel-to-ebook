import { IWebSiteCustom } from '../web-site.custom.js';

export const LnmtlComExtractor: IWebSiteCustom = {
    name: 'Lnmtl',
    url: 'https://lnmtl.com/',
    color: 'lnmtl',
    domain: 'lnmtl.com',
    puppeteer: true,
    articles: {
        selectors: ''
    },
    title: {
        selectors: '',
    },
    getChapter: (url: string, title: string): number => {
        title = title.trim();
        let chapter = -1;
        let result = title.match(/\d+/);
        if (result) {
            chapter = +result[0];
        }
        if (chapter === 0) {
            result = url.match(/\d+/);
            if (result) {
                chapter = +result[0];
            }
        }
        return chapter;
    },
};
