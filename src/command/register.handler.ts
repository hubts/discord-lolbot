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
        const { nicknameSplited, mainLaneArray, subLaneArray } = command.dto;
        const nickname = nicknameSplited.join(" ");
        const mainLane = mainLaneArray[0];
        const subLane = subLaneArray[0];

        // 라인 입력 검사
        if (!LaneEnums.includes(mainLane) || !LaneEnums.includes(subLane)) {
            return "잘못된 라인 정보입니다. 탑/정글/미드/원딜/서폿 중 하나로 작성해주세요.";
        }

        // Riot ID 검색
        const riotSummoner = await this.riotService.getSummonerByName(nickname);
        if (!riotSummoner) {
            return "찾을 수 없는 소환사명입니다.";
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

        this.logger.log(`New summoner ${nickname} registered/updated`);
        const embed = new EmbedBuilder()
            .setColor("DarkGreen")
            .setTitle(`${nickname} 소환사가 등록되었습니다.`)
            .setDescription("등록된 소환사 정보입니다.")
            .setThumbnail(
                `http://ddragon.leagueoflegends.com/cdn/12.15.1/img/profileicon/${riotSummoner.profileIconId}.png`
            )
            .addFields(
                {
                    name: "솔로랭크",
                    value: riotSummonerRank.solo,
                    inline: true,
                },
                {
                    name: "자유랭크",
                    value: riotSummonerRank.flex,
                    inline: true,
                }
            )
            .addFields({
                name: "라인 선호도",
                value: `(1)${strToEmbed(mainLane)} ${mainLane}\n(2)${strToEmbed(
                    subLane
                )} ${subLane}`,
                inline: false,
            });
        return {
            embeds: [embed],
        };
    }
}
