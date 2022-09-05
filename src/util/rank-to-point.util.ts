import { RankPointEnum } from "@enum";

export function rankToPoint(
    solo: {
        tier: string;
        rank: string;
    },
    flex: {
        tier: string;
        rank: string;
    }
): number {
    const soloPoint = solo.tier
        ? RankPointEnum[`${solo.tier} ${solo.rank}`]
        : 0;
    const flexPoint = flex.tier
        ? RankPointEnum[`${flex.tier} ${flex.rank}`]
        : 0;

    let result = soloPoint * 0.7 + flexPoint * 0.3;
    if (soloPoint === 0) {
        result = flexPoint * 0.9;
    }
    if (flexPoint === 0) {
        result = soloPoint;
    }

    return result;
}
