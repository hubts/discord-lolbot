import { ArgRange } from "@discord-nestjs/core";

export class SearchDto {
    @ArgRange(last => ({ formPosition: last }))
    nicknameSplited: string[];
}
