export interface IWebSiteCustom {
    name: string;
    url: string;
    color: string;
    domain: string | string[];
    articles: ({ selectors: string });
    puppeteer: boolean;
    title: ({ selectors: string });
    getChapter: (url: string, title: string) => number;
}
