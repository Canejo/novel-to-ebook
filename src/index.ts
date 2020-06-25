import * as yargs from 'yargs';
import { ExtractNovel, DownloadArticles, GenerateEbook } from './service';
const winston = require('./config/winston');


export class NovelToEbook {

    static async main(settings: { url: string, chapters: string, force: boolean }) {
        const extractNovel = new ExtractNovel();
        const downloadArticles = new DownloadArticles();
        const generateEbook = new GenerateEbook();
        
        const chapterArray = this.checkArray(settings.chapters);

        winston.info('[novel-to-ebook] > Initializing...');
        let webPage = await extractNovel.start(settings.url, settings.force);

        winston.info('[novel-to-ebook] > Extract articles');
        webPage = await downloadArticles.start({
            ...settings,
            webPage,
            chapterArray,
        });
        winston.info('[novel-to-ebook] > Generate ebook');
        await generateEbook.start(webPage);

    }

    private static checkArray(chapters: string): number[] {
        let chapterArray = [];
        if (/^[\],:{}\s]*$/.test(chapters.replace(/\\["\\\/bfnrtu]/g, '@').
        replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
        replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
            chapterArray = JSON.parse(chapters);
        }
        return chapterArray;
    }

}

const argv = yargs.options({
        url: { type: 'string', demandOption: true },
        force: { type: 'boolean', default: false, alias: 'f' },
        chapters: { type: 'string', default: 'all', alias: 'c', describe: 'Chapters to extract. Ex.: all, 1~4, [1,2,3,4]' }
    })
    .usage('Usage: $0 --url [string] -c [string]')
    .help('h')
    .alias('h', 'help')
    .argv;

NovelToEbook.main(argv);