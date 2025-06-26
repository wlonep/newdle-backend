import {Body, Controller, Get, Post} from '@nestjs/common';
import {AnswerService} from "./answer.service";


@Controller('/api')
export class AnswerController {
    constructor(private readonly quizSvc: AnswerService) {}

    @Get('today')
    getTodayQuiz() {
        return this.quizSvc.getTodayQuiz();
    }

    @Post('answer')
    check(@Body() body: { date: string; answer: string }) {
        const correct = this.quizSvc.checkAnswer(body.date, body.answer);
        return { correct };
    }
}
