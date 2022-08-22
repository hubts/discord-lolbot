import { DiscordModule } from "@discord-nestjs/core";
import { Module } from "@nestjs/common";
import * as dotenv from "dotenv";
import { GatewayIntentBits } from "discord.js";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Game, Summoner } from "@entity";
import { AppController } from "./app.controller";
import { CqrsModule } from "@nestjs/cqrs";
import { CommandHandlers } from "@command";
import { RiotService } from "./service";

dotenv.config({
    path: ".env",
});

@Module({
    imports: [
        TypeOrmModule.forFeature([Summoner, Game]),
        DiscordModule.forRootAsync({
            useFactory: () => ({
                token: process.env.BOT_TOKEN,
                discordClientOptions: {
                    intents: [
                        GatewayIntentBits.DirectMessages,
                        GatewayIntentBits.Guilds,
                        GatewayIntentBits.GuildBans,
                        GatewayIntentBits.GuildMessages,
                        GatewayIntentBits.MessageContent,
                    ],
                },
                prefix: "!",
            }),
        }),
        TypeOrmModule.forRootAsync({
            useFactory: () => ({
                type: "postgres",
                host: process.env.POSTGRES_HOST,
                port: +process.env.POSTGRES_PORT,
                username: "postgres",
                password: process.env.POSTGRES_PASSWORD,
                database: "postgres",
                entities: [__dirname + "/**/*.entity{.ts,.js}"],
                synchronize: true,
                logging: false,
                schema: "public",
                autoLoadEntities: true,
            }),
        }),
        CqrsModule,
    ],
    controllers: [AppController],
    providers: [
        {
            provide: "RiotService",
            useClass: RiotService,
        },
        ...CommandHandlers,
    ],
})
export class AppModule {}
