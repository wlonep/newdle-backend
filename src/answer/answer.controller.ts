import {Body, Controller, Get, NotFoundException, Param, Post} from '@nestjs/common';
import {AnswerService} from "./answer.service";


@Controller('/api')
export class AnswerController {
    constructor(private readonly quizSvc: AnswerService) {}

    @Get('today/:length')
    getTodayQuiz(@Param('length') length: string) {
        switch (length) {
            case 'short':
                return this.quizSvc.getTodayQuiz('short');
            case 'normal':
                return this.quizSvc.getTodayQuiz('normal');
            case 'long':
                return this.quizSvc.getTodayQuiz('long');
            default:
                throw new NotFoundException('Invalid length parameter.');
        }
    }

    @Post('answer/:length')
    check(@Body() body: { answer: string }, @Param('length') length: string, ) {
        switch (length) {
            case 'short':
                return this.quizSvc.checkAnswer(body.answer, 'short');
            case 'normal':
                return this.quizSvc.checkAnswer(body.answer, 'normal');
            case 'long':
                return this.quizSvc.checkAnswer(body.answer, 'long');
            default:
                throw new NotFoundException('Invalid length parameter.');
        }
    }
}
