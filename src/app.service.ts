/* eslint-disable @typescript-eslint/no-empty-function */
import { PrefixCommandTransformPipe } from "@discord-nestjs/common";
import {
    InjectDiscordClient,
    Once,
    Payload,
    PrefixCommand,
    UsePipes,
} from "@discord-nestjs/core";
import { Summoner } from "@entity";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Client, Message } from "discord.js";
import { Repository } from "typeorm";
import { RegisterDto } from "./dto";

@Injectable()
export class AppService {
    private readonly logger = new Logger(AppService.name);

    constructor(
        @InjectDiscordClient()
        private readonly client: Client,
        @InjectRepository(Summoner)
        private readonly summonerRepo: Repository<Summoner>
    ) {}

    @Once("ready")
    onReady() {
        this.logger.log(
            `Bot ${this.client.user.tag} was started at ${new Date()}`
        );
    }

    @PrefixCommand("등록")
    @UsePipes(PrefixCommandTransformPipe)
    async onRegister(
        @Payload() dto: RegisterDto,
        message: Message
    ): Promise<string> {
        const { nickname, lanes } = dto;
        const summoner = await this.summonerRepo.findOne({
            where: {
                userId: message.author.id,
            },
        });
        if (summoner) {
            return "중복된 소환사 등록입니다.";
        }

        if (lanes.length < 3) {
            return "선호하는 라인 3개를 모두 입력해주세요.";
        }

        const newSummoner = this.summonerRepo.create({
            userId: message.author.id,
            username: message.author.username,
            nickname: nickname,
            firstLane: lanes[0],
            secondLane: lanes[1],
            thirdLane: lanes[2],
        });
        try {
            await this.summonerRepo.save(newSummoner);
        } catch (error) {
            return `에러가 발생했습니다. ${error}`;
        }
        return `소환사 ${nickname} 님을 성공적으로 등록하였습니다.`;
    }
}
