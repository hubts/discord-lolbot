import { EmbedEnum } from "@enum";

export function strToEmbed(str: string): string {
    switch (str) {
        case "탑":
            return EmbedEnum.TOP;
        case "정글":
            return EmbedEnum.JUNGLE;
        case "미드":
            return EmbedEnum.MID;
        case "원딜":
            return EmbedEnum.BOT;
        case "서폿":
            return EmbedEnum.SUPPORT;
        case "IRON":
            return EmbedEnum.IRON;
        case "BRONZE":
            return EmbedEnum.BRONZE;
        case "SILVER":
            return EmbedEnum.SILVER;
        case "GOLD":
            return EmbedEnum.GOLD;
        case "PLATINUM":
            return EmbedEnum.PLATINUM;
        case "DIAMOND":
            return EmbedEnum.DIAMOND;
        case "MASTER":
            return EmbedEnum.MASTER;
        case "GRANDMASTER":
            return EmbedEnum.GRANDMASTER;
        case "CHALLENGER":
            return EmbedEnum.CHALLENGER;
    }
}
