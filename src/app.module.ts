import {Module} from '@nestjs/common';
import {WordModule} from "./word/word.module";
import {AnswerModule} from "./answer/answer.module";

@Module({
    imports: [WordModule, AnswerModule],
    controllers: [],
    providers: [],
})
export class AppModule {
}
