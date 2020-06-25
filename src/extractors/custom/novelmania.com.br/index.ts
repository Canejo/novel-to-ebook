import { IWebSiteCustom } from '../web-site.custom';

export const NovelmaniaComBrExtractor: IWebSiteCustom = {
    name: 'Novel Mania',
    url: 'http://novelmania.com.br/',
    color: 'medium',
    domain: 'novelmania.com.br',
    puppeteer: false,
    articles: {
        selectors: '.collapseomatic a, .collapseomatic_content a'
    },
    title: {
        selectors: 'h1',
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
    }
};
