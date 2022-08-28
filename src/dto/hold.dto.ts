import { ArgNum, ArgRange } from "@discord-nestjs/core";

export class HoldDto {
    @ArgNum(() => ({ position: 0 }))
    title: string;

    @ArgRange(last => ({ formPosition: last }))
    descriptionSplited: string[];
}
