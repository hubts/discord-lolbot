/* eslint-disable @typescript-eslint/no-empty-function */
import { PrefixCommandTransformPipe } from "@discord-nestjs/common";
import {
    InjectDiscordClient,
    Once,
    Payload,
    PrefixCommand,
    UsePipes,
} from "@discord-nestjs/core";
import { Controller, Logger } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { Client, Message, MessageOptions } from "discord.js";
import {
    runOnTransactionCommit,
    runOnTransactionComplete,
    runOnTransactionRollback,
    Transactional,
} from "typeorm-transactional-cls-hooked";
import { RegisterCommand } from "./command";
import { RegisterDto } from "./dto";

@Controller()
export class AppController {
    private readonly logger = new Logger(AppController.name);

    constructor(
        @InjectDiscordClient()
        private readonly client: Client,
        private readonly commandBus: CommandBus
    ) {}

    @Once("ready")
    onReady() {
        this.logger.log(
            `Bot (${this.client.user.tag}) was started at (${new Date()})`
        );
    }

    @Transactional()
    @PrefixCommand("등록")
    @UsePipes(PrefixCommandTransformPipe)
    async onRegister(
        @Payload() dto: RegisterDto,
        message: Message
    ): Promise<void> {
        try {
            const command = new RegisterCommand(message, dto);
            const result: MessageOptions | string =
                await this.commandBus.execute(command);
            runOnTransactionCommit(() => {});
            await message.reply(result);
        } catch (error) {
            runOnTransactionRollback(() => {});
            await message.reply(error);
        } finally {
            runOnTransactionComplete(() => {});
        }
    }
}
