import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { RegisterDto } from "@dto";
import { Inject, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Summoner } from "@entity";
import { Repository } from "typeorm";
import { Message, EmbedBuilder, MessageOptions } from "discord.js";
import { LaneEnums } from "@enum";
import { strToEmbed } from "@util";
import { RiotService } from "src/service";

export class RegisterCommand implements ICommand {
    constructor(
        public readonly message: Message,
        public readonly dto: RegisterDto
    ) {}
}

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
    private readonly logger = new Logger(RegisterHandler.name);

    constructor(
        @Inject("RiotService")
        private readonly riotService: RiotService,
        @InjectRepository(Summoner)
        private readonly summonerRepo: Repository<Summoner>
    ) {}

    async execute(command: RegisterCommand): Promise<MessageOptions | string> {
        const { author } = command.message;
        const { nicknameSplited, mainLaneInArray, subLaneInArray } =
            command.dto;
        const nickname = nicknameSplited.join(" ");
        const mainLane = mainLaneInArray[0];
        const subLane = subLaneInArray[0];

        // 라인 입력 검사
        if (!LaneEnums.includes(mainLane) || !LaneEnums.includes(subLane)) {
            return "잘못된 라인 정보입니다. 탑/정글/미드/원딜/서폿 중 하나로 작성해주세요.";
        }

        // Riot ID 검색
        const riotSummoner = await this.riotService.getSummonerByName(nickname);
        if (!riotSummoner) {
            return "소환사 검색에 실패하였습니다.";
        }
        // Riot 랭크 검색
        const riotSummonerRank = await this.riotService.getSummonerRankById(
            riotSummoner.id
        );

        // 소환사 정보 검색
        const summoner = await this.summonerRepo.findOne({
            where: {
                userId: author.id,
            },
        });
        if (summoner && summoner.userId !== author.id) {
            return "다른 사람의 소환사 정보를 수정할 수 없습니다.";
        }

        // 소환사 정보 업데이트
        const newSummoner = this.summonerRepo.create({
            ...summoner,
            userId: author.id,
            username: author.username,
            nickname: nickname,
            mainLane,
            subLane,
        });
        try {
            await this.summonerRepo.save(newSummoner);
        } catch (error) {
            throw new Error(`저장 실패: ${error}`);
        }

        // 결과
        const title = `"${nickname}" 소환사가 등록되었습니다.`;
        const thumbnail = `http://ddragon.leagueoflegends.com/cdn/12.15.1/img/profileicon/${riotSummoner.profileIconId}.png`;
        const soloRankText = riotSummonerRank.solo;
        const flexRankText = riotSummonerRank.flex;
        const mainLaneText = `${strToEmbed(mainLane)} ${mainLane}`;
        const subLaneText = `${strToEmbed(subLane)} ${subLane}`;
        const embed = new EmbedBuilder()
            .setColor("DarkGreen")
            .setTitle(title)
            .setThumbnail(thumbnail)
            .addFields(
                {
                    name: "<솔로랭크>",
                    value: soloRankText,
                    inline: true,
                },
                {
                    name: "<자유랭크>",
                    value: flexRankText,
                    inline: true,
                }
            )
            .addFields({
                name: "<라인 선호도>",
                value: `${mainLaneText} / ${subLaneText}`,
                inline: false,
            });
        this.logger.log(`New summoner "${nickname}" registered/updated`);
        return {
            embeds: [embed],
        };
    }
}
