import { ArgRange } from "@discord-nestjs/core";

export class HoldDto {
    @ArgRange(last => ({ formPosition: last }))
    description: string[];
}
