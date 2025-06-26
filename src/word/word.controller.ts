import {Controller, Get} from '@nestjs/common';
import { WordService } from './word.service';

@Controller('/api')
export class WordController {
    constructor(private readonly wordService: WordService) {}

    @Get('/list')
    async getWordList() {
        return this.wordService.getAllKeys();
    }
}