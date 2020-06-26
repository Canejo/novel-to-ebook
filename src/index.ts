import * as yargs from 'yargs';
import { ExtractNovel, DownloadArticles } from './service';
const winston = require('./config/winston');

const ARTICLES_MOBI = 150;

export class NovelToEbook {

    static async main(settings: { url: string, force: boolean, count: number }) {
        const extractNovel = new ExtractNovel();
        const downloadArticles = new DownloadArticles();

        winston.info('> [novel-to-ebook] Initializing...');
        let webPage = await extractNovel.start(settings.url, settings.force);

        winston.info('> [novel-to-ebook] Extract articles');
        await downloadArticles.start({
            ...settings,
            webPage,
        });
    }
}

const argv = yargs.options({
        url: { type: 'string', demandOption: true },
        force: { type: 'boolean', default: false, alias: 'f' },
        count: { type: 'number', default: 150, alias: 'c' }
    })
    .usage('Usage: $0 --url [string]')
    .help('h')
    .alias('h', 'help')
    .argv;

NovelToEbook.main(argv);