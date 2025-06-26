import {Injectable, NotFoundException, OnModuleInit} from '@nestjs/common';
import * as fs from 'fs/promises';


export interface WordEntry {
    jamo_key: string;
    word: string;
    definition: string;
}

@Injectable()
export class WordService implements OnModuleInit {
    private shortData: Record<string, WordEntry> = {};
    private normalData: Record<string, WordEntry> = {};
    private longData: Record<string, WordEntry> = {};
    private readonly stdDate = new Date('2025-06-01');
    private readonly msPerDay = 1000 * 60 * 60 * 24;

    async onModuleInit() {
        const [shortRaw, normalRaw, longRaw] = await Promise.all([
            fs.readFile('./src/assets/words_4.json', 'utf-8'),
            fs.readFile('./src/assets/words_6.json', 'utf-8'),
            fs.readFile('./src/assets/words_12.json', 'utf-8'),
        ]);

        this.shortData = JSON.parse(shortRaw);
        this.normalData = JSON.parse(normalRaw);
        this.longData = JSON.parse(longRaw);
    }

    getKeys(size: 'short' | 'normal' | 'long'): string[] {
        if (size === 'short') return Object.keys(this.shortData);
        if (size === 'long') return Object.keys(this.longData);
        return Object.keys(this.normalData);
    }

    getByKey(key: string, size: 'short' | 'normal' | 'long' = 'normal'): WordEntry | null {
        const data =
            size === 'short'
                ? this.shortData
                : size === 'long'
                    ? this.longData
                    : this.normalData;
        return data[key] ?? null;
    }

    getByIndex(idx: number, size: 'short' | 'normal' | 'long' = 'normal'): WordEntry | null {
        const keys = this.getKeys(size);
        const key = keys[idx];
        const entry = key ? this.getByKey(key, size) : null;

        return entry ? {...entry, jamo_key: key} : null;
    }

    getByDate(dateStr: string, size: 'short' | 'normal' | 'long'): WordEntry {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            throw new NotFoundException('Invalid date type.');
        }

        const idx = Math.floor(
            (date.getTime() - this.stdDate.getTime()) / this.msPerDay,
        );

        const entry = this.getByIndex(idx, size);
        if (!entry) {
            throw new NotFoundException('Word not found.');
        }

        return entry;
    }
}
