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

    getTodayQuiz() {
        const todayISO = new Date().toISOString().split('T')[0];
        const entry = this.wordSvc.getByDate(todayISO);

        const salt = todayISO;
        const answerHash = this.hashAnswer(entry.jamo_key, salt);

        return {salt, answerHash};
    }

    checkAnswer(date: string, userAnswer: string) {
        const entry = this.wordSvc.getByDate(date);
        const correct = this.hashAnswer(userAnswer, date) === this.hashAnswer(entry.jamo_key, date);
        if (correct) {
            return {
                correct: true,
                jamo_key: entry.jamo_key,
                word: entry.word,
                definition: entry.definition
            };
        }
        return {correct: false};
    }
}