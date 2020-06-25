import { IWebSiteCustom } from '../web-site.custom';

export const WwwWuxiaworldComExtractor: IWebSiteCustom = {
    name: 'WuxiaWorld',
    url: 'https://www.wuxiaworld.com/',
    color: 'secondary',
    domain: 'www.wuxiaworld.com',
    puppeteer: false,
    articles: {
        selectors: '#accordion a'
    },
    title: {
        selectors: 'h2',
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
