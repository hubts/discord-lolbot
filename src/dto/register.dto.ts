import { ArgNum, ArgRange } from "@discord-nestjs/core";

export class RegisterDto {
    @ArgNum(() => ({ position: 0 }))
    nickname: string;

    @ArgRange(() => ({ formPosition: 1, toPosition: 4 }))
    lanes: string[];
}
