import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { Inject, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Summoner } from "@entity";
import { Repository } from "typeorm";
import { Message, EmbedBuilder, MessageOptions } from "discord.js";
import { strToEmbed } from "@util";
import { RiotService } from "src/service";
import { SearchDto } from "@dto";
import { ErrorMessage } from "src/interface";

export class SearchCommand implements ICommand {
    constructor(
        public readonly message: Message,
        public readonly dto: SearchDto
    ) {}
}

@CommandHandler(SearchCommand)
export class SearchHandler implements ICommandHandler<SearchCommand> {
    private readonly logger = new Logger(SearchHandler.name);

    constructor(
        @Inject("RiotService")
        private readonly riotService: RiotService,
        @InjectRepository(Summoner)
        private readonly summonerRepo: Repository<Summoner>
    ) {}

    async execute(command: SearchCommand): Promise<MessageOptions | string> {
        const { nicknameSplited } = command.dto;
        const { author } = command.message;
        let nickname = nicknameSplited.join(" ");

        // 자신의 소환사 닉네임 검색
        const summoner = await this.summonerRepo.findOne({
            authorId: author.id,
        });
        if (!nickname && !summoner) {
            return ErrorMessage.SUMMONER_NOT_FOUND_OR_NOT_INSERTED;
        }

        // 검색할 소환사 닉네임 결정
        nickname = !nickname ? summoner.nickname : nickname;

        // 소환사 닉네임 기반의 정보 조회
        const searchingSummoner = await this.summonerRepo.findOne({
            nickname,
        });

        // Riot ID 검색
        const riotSummoner = await this.riotService.getSummonerByName(nickname);
        if (!riotSummoner) {
            return ErrorMessage.SUMMONER_GET_FAILED;
        }
        // Riot 랭크 검색
        const riotSummonerRank = await this.riotService.getSummonerRankById(
            riotSummoner.id
        );

        // 결과
        const title = `"${nickname}" 소환사 정보가 검색되었습니다.`;
        const thumbnail = `http://ddragon.leagueoflegends.com/cdn/12.15.1/img/profileicon/${riotSummoner.profileIconId}.png`;
        const soloRankText = riotSummonerRank.solo;
        const flexRankText = riotSummonerRank.flex;
        const mainLaneText = searchingSummoner
            ? `${strToEmbed(searchingSummoner.mainLane)} ${
                  searchingSummoner.mainLane
              }`
            : "정보 없음";
        const subLaneText = searchingSummoner
            ? `${strToEmbed(searchingSummoner.subLane)} ${
                  searchingSummoner.subLane
              }`
            : "정보 없음";
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
        this.logger.log(`New summoner "${nickname}" Searched/updated`);
        return {
            embeds: [embed],
        };
    }
}
