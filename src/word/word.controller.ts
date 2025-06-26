import {Controller, Get, NotFoundException, Param} from '@nestjs/common';
import { WordService } from './word.service';

@Controller('/api')
export class WordController {
    constructor(private readonly wordService: WordService) {}

    @Get('/list/:length')
    async getWordList(@Param('length') length: string) {
        switch (length) {
            case 'short':
                return this.wordService.getKeys('short');
            case 'normal':
                return this.wordService.getKeys('normal');
            case 'long':
                return this.wordService.getKeys('long');
            default:
                throw new NotFoundException('Invalid length parameter.');
        }
    }

    @Get('/test/:length')
    async test(@Param('length') length: string) {
        switch (length) {
            case 'short':
                return this.wordService.getByDate('2025-06-26', 'short');
            case 'normal':
                return this.wordService.getByDate('2025-06-26', 'normal');
            case 'long':
                return this.wordService.getByDate('2025-06-26', 'long');
            default:
                throw new NotFoundException('Invalid length parameter.');
        }
    }
}