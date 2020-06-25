import { ArticleEntity } from '../generic/article.entity';
import { IWebSiteCustom } from './web-site.custom';

export interface IWebSiteJson extends IWebSiteCustom {
    getArticles: (json: string) => ArticleEntity[];
    getTitle: (json: string) => string;
}
