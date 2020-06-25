import { IWebSiteCustom } from '../web-site.custom';

export const SaikaiscanComBrExtractor: IWebSiteCustom = {
    name: 'Saikai Scan',
    url: 'https://saikaiscan.com.br/',
    color: 'tertiary',
    domain: 'saikaiscan.com.br',
    puppeteer: false,
    articles: {
        selectors: '.project-chapters a'
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
