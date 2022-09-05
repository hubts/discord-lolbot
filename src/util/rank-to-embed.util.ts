import { EmbedEnum } from "@enum";

export function rankToEmbed(tier: string, rank: string): string {
    if (!tier || !rank) {
        return "정보 없음";
    }

    return `${EmbedEnum[tier]} ${tier} ${rank}`;
}
