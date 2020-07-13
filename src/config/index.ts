import { resolve } from 'path';

export class Config {
    static path = resolve(__dirname, '..', '..', 'ebook');
    static cache = resolve(__dirname, '..', '..', 'ebook', 'cache');
}
