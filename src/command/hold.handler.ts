import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Game, Summoner } from "@entity";
import { Repository } from "typeorm";
import { Message, EmbedBuilder, MessageOptions } from "discord.js";
import { HoldDto } from "@dto";
import { ErrorMessage } from "src/interface";

export class HoldCommand implements ICommand {
    constructor(
        public readonly message: Message,
        public readonly dto: HoldDto
    ) {}
}

@CommandHandler(HoldCommand)
export class HoldHandler implements ICommandHandler<HoldCommand> {
    private readonly logger = new Logger(HoldHandler.name);

    constructor(
        @InjectRepository(Summoner)
        private readonly summonerRepo: Repository<Summoner>,
        @InjectRepository(Game)
        private readonly gameRepo: Repository<Game>
    ) {}

    async execute(command: HoldCommand): Promise<MessageOptions | string> {
        const { title, descriptionSplited } = command.dto;
        const { author } = command.message;
        const description = descriptionSplited.join(" ");

        // 개최자 Summoner 가져오기
        const summoner = await this.summonerRepo.findOne({
            authorId: author.id,
        });
        if (!summoner) {
            return ErrorMessage.SUMMONER_NOT_FOUND;
        }

        // 현재 진행중인 Game 가져오기
        const existingGame = await this.gameRepo.findOne({
            relations: ["summoner"],
            where: {
                isFinished: false,
            },
        });
        if (
            existingGame &&
            existingGame.creator.authorId !== summoner.authorId
        ) {
            return ErrorMessage.GAME_ALREADY_EXISTED;
        }

        // Game 생성하기
        const newOrUpdatedGame = this.gameRepo.create({
            ...existingGame,
            title,
            description,
            creator: summoner,
            players: [],
        });

        // Game 저장하기
        try {
            await this.gameRepo.save(newOrUpdatedGame);
        } catch (error) {
            throw new Error(`저장 실패: ${error}`);
        }

        // 결과
        const thumbnail = `http://ddragon.leagueoflegends.com/cdn/12.15.1/img/profileicon/1.png`;
        let embed = new EmbedBuilder()
            .setColor("DarkGreen")
            .setTitle(title)
            .setThumbnail(thumbnail);
        if (description) {
            embed = embed.addFields({
                name: "내용",
                value: description,
            });
        }
        this.logger.log(`New game by "${summoner.nickname}" held/updated`);
        return {
            embeds: [embed],
        };
    }
}
