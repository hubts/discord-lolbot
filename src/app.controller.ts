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
import { HoldCommand, RegisterCommand, SearchCommand } from "@command";
import { HoldDto, RegisterDto, SearchDto } from "@dto";

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
    ): Promise<MessageOptions | string> {
        try {
            const command = new RegisterCommand(message, dto);
            const result: MessageOptions | string =
                await this.commandBus.execute(command);
            runOnTransactionCommit(() => {});
            if (!result) {
                return "명령어 처리에 실패하였습니다.";
            }
            return result;
        } catch (error) {
            runOnTransactionRollback(() => {});
            return error.message;
        } finally {
            runOnTransactionComplete(() => {});
        }
    }

    @Transactional()
    @PrefixCommand("정보")
    @UsePipes(PrefixCommandTransformPipe)
    async onSearch(
        @Payload() dto: SearchDto,
        message: Message
    ): Promise<MessageOptions | string> {
        try {
            const command = new SearchCommand(message, dto);
            const result: MessageOptions | string =
                await this.commandBus.execute(command);
            runOnTransactionCommit(() => {});
            if (!result) {
                return "명령어 처리에 실패하였습니다.";
            }
            return result;
        } catch (error) {
            runOnTransactionRollback(() => {});
            return error.message;
        } finally {
            runOnTransactionComplete(() => {});
        }
    }

    @Transactional()
    @PrefixCommand("개최")
    @UsePipes(PrefixCommandTransformPipe)
    async onOpenGame(
        @Payload() dto: HoldDto,
        message: Message
    ): Promise<MessageOptions | string> {
        try {
            const command = new HoldCommand(message, dto);
            const result: MessageOptions | string =
                await this.commandBus.execute(command);
            runOnTransactionCommit(() => {});
            if (!result) {
                return "명령어 처리에 실패하였습니다.";
            }
            return result;
        } catch (error) {
            runOnTransactionRollback(() => {});
            return error.message;
        } finally {
            runOnTransactionComplete(() => {});
        }
    }

    // @Transactional()
    // @PrefixCommand("취소")
    // @UsePipes(PrefixCommandTransformPipe)
    // async onCancelGame(
    //     @Payload() dto: CancelDto,
    //     message: Message
    // ): Promise<MessageOptions | string> {
    //     try {
    //         const command = new HoldCommand(message, dto);
    //         const result: MessageOptions | string =
    //             await this.commandBus.execute(command);
    //         runOnTransactionCommit(() => {});
    //         if (!result) {
    //             return "명령어 처리에 실패하였습니다.";
    //         }
    //         return result;
    //     } catch (error) {
    //         runOnTransactionRollback(() => {});
    //         return error.message;
    //     } finally {
    //         runOnTransactionComplete(() => {});
    //     }
    // }
}
