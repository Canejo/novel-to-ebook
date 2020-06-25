import { ArticleEntity } from './article.entity';
import { IWebSiteCustom } from '../custom/web-site.custom';

export class WebPageEntity {
    url: string;
    title: string;
    articles: ArticleEntity[];
    articleCount: number;
    firstChapter: number;
    lastChapter: number;
    extractor: IWebSiteCustom;
}
