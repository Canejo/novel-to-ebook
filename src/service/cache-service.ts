import { Config } from "../config";

import { resolve } from 'path';
import { writeFileSync, existsSync, readFileSync } from 'fs';
const md5 = require('md5');

export class CacheService {
    static set<T>(key: string, obj: T): void {
        const pathCache = this.getCacheName(key);
        writeFileSync(pathCache, JSON.stringify(obj), 'UTF-8');
    }

    static get<T>(key: string): T {
        const pathCache = this.getCacheName(key);
        const json = readFileSync(pathCache, 'UTF-8');
        return JSON.parse(json) as T;
    }

    static exists(key: string): boolean {
        const pathCache = this.getCacheName(key);
        return existsSync(pathCache);
    }

    private static getCacheName(key: string) {
        const fileName = md5(key);
        return resolve(Config.cache, `${fileName}.json`);
    }
}