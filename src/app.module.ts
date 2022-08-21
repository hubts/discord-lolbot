import { DiscordModule } from "@discord-nestjs/core";
import { Module } from "@nestjs/common";
import * as dotenv from "dotenv";
import { GatewayIntentBits } from "discord.js";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppService } from "./app.service";
import { Summoner } from "@entity";

dotenv.config({
    path: ".env",
});

@Module({
    imports: [
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
        TypeOrmModule.forFeature([Summoner]),
    ],
    providers: [AppService],
})
export class AppModule {}
