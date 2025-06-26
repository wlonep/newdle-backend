import {Injectable, NotFoundException, OnModuleInit} from '@nestjs/common';
import * as fs from 'fs/promises';


export interface WordEntry {
    jamo_key: string;
    word: string;
    definition: string;
}

@Injectable()
export class WordService implements OnModuleInit {
    private data: Record<string, { word: string; definition: string }> = {};
    private readonly stdDate = new Date('2025-06-01');
    private readonly msPerDay = 1000 * 60 * 60 * 24;

    async onModuleInit() {
        const file = await fs.readFile(
            './src/assets/words_6.json',
            'utf-8',
        );
        this.data = JSON.parse(file);
    }

    getAllKeys(): string[] {
        return Object.keys(this.data);
    }

    getByIndex(idx: number): WordEntry | null {
        const key = this.getAllKeys()[idx];
        return key ? {jamo_key: key, ...this.data[key]} : null;
    }

    getByDate(dateStr: string): WordEntry {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            throw new NotFoundException('잘못된 날짜 형식입니다.');
        }

        const idx = Math.floor(
            (date.getTime() - this.stdDate.getTime()) / this.msPerDay,
        );

        const entry = this.getByIndex(idx);
        if (!entry) {
            throw new NotFoundException('해당 날짜에 대응하는 단어가 없습니다.');
        }
        return entry;
    }
}
