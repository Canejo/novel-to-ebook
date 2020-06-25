const { extract } = require('./service/extract-novel');
const winston = require('./config/winston');

var argv = require('yargs')
    .usage('Usage: $0 --url [string] -c [string]')
    .demandOption(['url'])
    .default({ mobi : true, epub : true, c: 'all' })
    .help('h')
    .alias('h', 'help')
    .alias('c','chapters')
    .describe('c', 'Chapters to extract. Ex.: all, 1~4, [1,2,3,4]')
    .argv;
;
const { url, chapters, mobi, epub } = argv;
let chapterArray = [];
if (/^[\],:{}\s]*$/.test(chapters.replace(/\\["\\\/bfnrtu]/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
    chapterArray = JSON.parse(chapters);
}

winston.info('[novel-to-ebook] > Initializing...');

extract({
    url, 
    chapters,
    chapterArray
});