import {Controller, Get, NotFoundException, Param} from '@nestjs/common';
import {WordService} from './word.service';

@Controller('/api')
export class WordController {
    constructor(private readonly wordService: WordService) {
    }

    @Get()
    getRoot() {
        return {message: 'Hello World!'};
    }

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

    @Get('/time')
    getServerTime() {
        return new Date().toLocaleString('sv-SE').split(' ')[0];
    }
}