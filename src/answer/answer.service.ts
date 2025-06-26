import {Injectable} from "@nestjs/common";
import {WordService} from "../word/word.service";
import {createHash} from "crypto";

@Injectable()
export class AnswerService {
    constructor(private readonly wordSvc: WordService) {
    }

    hashAnswer(answer: string, salt: string): string {
        return createHash('sha256').update(answer + salt).digest('hex');
    }

    getTodayQuiz(size: 'short' | 'normal' | 'long') {
        const todayISO = new Date().toISOString().split('T')[0];
        const entry = this.wordSvc.getByDate(todayISO, size);

        const salt = todayISO;
        const answerHash = this.hashAnswer(entry.jamo_key, salt);

        return {size, salt, answerHash};
    }

    checkAnswer(userAnswer: string, size: 'short' | 'normal' | 'long') {
        const todayISO = new Date().toISOString().split('T')[0];
        const entry = this.wordSvc.getByDate(todayISO, size);
        const correct = this.hashAnswer(userAnswer, todayISO) === this.hashAnswer(entry.jamo_key, todayISO);

        if (correct) {
            return {
                correct: true,
                size,
                jamo_key: entry.jamo_key,
                word: entry.word,
                definition: entry.definition
            };
        }
        return {correct: false};
    }
}