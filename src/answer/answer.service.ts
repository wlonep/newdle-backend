import {Injectable} from "@nestjs/common";
import {WordService} from "../word/word.service";
import {createHash} from "crypto";

type CharStatus = 'correct' | 'present' | 'absent'


@Injectable()
export class AnswerService {
    constructor(private readonly wordSvc: WordService) {
    }

    getGuessStatuses = (guess: string, solution: string): CharStatus[] => {
        const splitSolution = solution.split('')
        const splitGuess = guess.split('')

        const solutionCharsTaken = splitSolution.map(() => false)
        const statuses: CharStatus[] = Array.from({length: guess.length})

        splitGuess.forEach((ch, i) => {
            if (ch === splitSolution[i]) {
                statuses[i] = 'correct'
                solutionCharsTaken[i] = true
            }
        })

        splitGuess.forEach((ch, i) => {
            if (statuses[i]) return                // already correct

            if (!splitSolution.includes(ch)) {
                statuses[i] = 'absent'
                return
            }

            const j = splitSolution.findIndex(
                (x, idx) => x === ch && !solutionCharsTaken[idx],
            )
            if (j > -1) {
                statuses[i] = 'present'
                solutionCharsTaken[j] = true
            } else {
                statuses[i] = 'absent'
            }
        })
        return statuses
    }


    hashAnswer(answer: string, salt: string): string {
        return createHash('sha256').update(answer + salt).digest('hex');
    }

    getTodayQuiz(size: 'short' | 'normal' | 'long') {
        const today = new Date().toLocaleString('sv-SE').split(' ')[0];
        const entry = this.wordSvc.getByDate(today, size);

        const salt = today;
        const answerHash = this.hashAnswer(entry.jamo_key, salt);

        return {size, salt, answerHash};
    }

    checkAnswer(input: { answer: string, last?: boolean }, size: 'short' | 'normal' | 'long') {
        const today = new Date().toLocaleString('sv-SE').split(' ')[0];
        const entry = this.wordSvc.getByDate(today, size);
        const statuses = this.getGuessStatuses(input.answer, entry.jamo_key)

        const correct = this.hashAnswer(input.answer, today) === this.hashAnswer(entry.jamo_key, today);
        if (correct) {
            return {
                correct: true,
                id: entry.id,
                size,
                jamo_key: entry.jamo_key,
                word: entry.word,
                definition: entry.definition,
                statuses,
            };
        }

        if (input?.last) {
            return {
                correct: false,
                id: entry.id,
                size,
                jamo_key: input.answer,
                word: entry.word,
                definition: entry.definition,
                statuses,
            };
        }
        return {correct: false, id: entry.id, size, statuses, jamo_key: input.answer}
    }
}