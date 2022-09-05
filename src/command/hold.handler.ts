import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Game, Summoner } from "@entity";
import { Repository } from "typeorm";
import { Message, EmbedBuilder, MessageOptions } from "discord.js";
import { HoldDto } from "@dto";
import { ErrorMessage } from "src/interface";
import { getProfileIconById } from "@util";

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
        const { description } = command.dto;
        const { author } = command.message;

        // Description 길이 확인
        if (!description.length) {
            return "내전에 대한 설명을 작성해주세요.";
        }

        // 개최자 Summoner 가져오기
        const summoner = await this.summonerRepo.findOne({
            authorId: author.id,
        });
        if (!summoner) {
            return ErrorMessage.SUMMONER_NOT_FOUND;
        }

        // 현재 진행중인 Game 가져오기
        const existingGame = await this.gameRepo.findOne({
            relations: ["creator"],
            where: {
                isFinished: false,
            },
        });
        this.logger.log(JSON.stringify(existingGame));
        if (
            existingGame &&
            existingGame.creator.authorId !== summoner.authorId
        ) {
            return ErrorMessage.GAME_ALREADY_EXISTED;
        }

        // Game 생성하기
        const newOrUpdatedGame = this.gameRepo.create({
            ...existingGame,
            title: `(${summoner.nickname})님의 내전`,
            description: description.join(" "),
            creator: summoner,
            players: existingGame ? existingGame.players : [],
        });
        this.logger.log(JSON.stringify(newOrUpdatedGame));

        // Game 저장하기
        let savedGame: Game;
        try {
            savedGame = await this.gameRepo.save(newOrUpdatedGame);
        } catch (error) {
            throw new Error(`저장 실패: ${error}`);
        }

        // 결과
        const thumbnail = getProfileIconById(1);
        const embed = new EmbedBuilder()
            .setColor("DarkGreen")
            .setTitle(savedGame.title)
            .setThumbnail(thumbnail)
            .addFields({
                name: "🗒 설명",
                value: savedGame.description,
            });

        this.logger.log(`New game by "${summoner.nickname}" held/updated`);
        return {
            embeds: [embed],
        };
    }
}
