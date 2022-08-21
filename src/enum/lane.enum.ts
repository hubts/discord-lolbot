export enum LaneEnum {
    TOP = "탑",
    JUNGLE = "정글",
    MID = "미드",
    BOT = "원딜",
    SUPPORT = "서폿",
}

export const LaneEnums: string[] = Object.values(LaneEnum)
    .filter(value => typeof value === "string")
    .map(value => value as string);
