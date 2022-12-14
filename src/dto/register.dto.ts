import { ArgRange } from "@discord-nestjs/core";

export class RegisterDto {
    @ArgRange(last => ({ formPosition: 0, toPosition: last - 2 }))
    nicknameSplited: string[];

    @ArgRange(last => ({ formPosition: last, toPosition: last + 1 }))
    mainLaneInArray: string[];

    @ArgRange(last => ({ formPosition: last }))
    subLaneInArray: string[];
}
