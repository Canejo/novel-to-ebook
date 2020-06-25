import { IWebSiteCustom } from '../web-site.custom.js';

export const BabelnovelComExtractor: IWebSiteCustom = {
    name: 'Babel Novel',
    url: 'https://babelnovel.com/',
    color: 'warning',
    domain: 'babelnovel.com',
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
        let result = url.match(/\d+/);
        if (result) {
            chapter = +result[0];
        }
        if (chapter === 0) {
            result = title.match(/\d+/);
            if (result) {
                chapter = +result[0];
            }
        }
        return chapter;
    },
};
