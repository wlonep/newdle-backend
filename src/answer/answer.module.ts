import {Module} from "@nestjs/common";
import {WordModule} from "../word/word.module";
import {AnswerService} from "./answer.service";
import {AnswerController} from "./answer.controller";

@Module({
    imports: [WordModule],
    providers: [AnswerService],
    controllers: [AnswerController]
})
export class AnswerModule {}