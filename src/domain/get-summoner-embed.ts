import {
    getProfileIconById,
    rankToEmbed,
    rankToPoint,
    strToEmbed,
} from "@util";
import { EmbedBuilder } from "discord.js";

export function getSummonerEmbed(input: {
    nickname: string;
    profileIconId: number;
    solo: {
        tier: string;
        rank: string;
    };
    flex: {
        tier: string;
        rank: string;
    };
    mainLane: string;
    subLane: string;
}): EmbedBuilder {
    const { nickname, profileIconId, solo, flex, mainLane, subLane } = input;
    const title = `${nickname} 소환사의 정보입니다.`;
    const thumbnail = getProfileIconById(profileIconId);
    const mainLaneText = mainLane
        ? `${strToEmbed(mainLane)} ${mainLane}`
        : "정보 없음";
    const subLaneText = subLane
        ? `${strToEmbed(subLane)} ${subLane}`
        : "정보 없음";
    const soloRankText = rankToEmbed(solo.tier, solo.rank);
    const flexRankText = rankToEmbed(flex.tier, flex.rank);

    const embed = new EmbedBuilder()
        .setColor("DarkGreen")
        .setTitle(title)
        .setThumbnail(thumbnail)
        .addFields([
            {
                name: "✅ 솔로랭크",
                value: `    ${soloRankText}`,
                inline: true,
            },
            {
                name: "✅ 자유랭크",
                value: `    ${flexRankText}`,
                inline: true,
            },
        ])
        .addFields({
            name: "🌈 선호하는 라인",
            value: `- 주라인은 ( ${mainLaneText} ) 입니다.\n- 서브라인은 ( ${subLaneText} ) 입니다.`,
        })
        .addFields({
            name: "💪 소환사의 계산된 랭크 포인트",
            value: `( ${rankToPoint(solo, flex)} ) 점입니다.`,
        });
    return embed;
}
