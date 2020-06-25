import { IWebSiteCustom } from '../web-site.custom.js';

export const MtledNovelsComExtractor: IWebSiteCustom = {
    name: 'MTLed',
    url: 'https://mtled-novels.com/',
    color: 'primary',
    domain: 'mtled-novels.com',
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
