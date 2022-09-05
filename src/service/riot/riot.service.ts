import { QueueTypeEnum } from "@enum";
import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";
import { LeagueEntry, Summoner, SummonerRank } from "./interface";

@Injectable()
export class RiotService {
    private readonly logger = new Logger(RiotService.name);
    private readonly RIOT_API_KEY = process.env.RIOT_API_KEY;
    private readonly API_KEY_PARAM = `?api_key=${this.RIOT_API_KEY}`;

    private async getDataByUrl(url: string) {
        const response = await axios.get(encodeURI(url + this.API_KEY_PARAM));
        return response.data;
    }

    async getSummonerByName(name: string): Promise<Summoner> {
        const url = `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}`;
        try {
            const data: Summoner = await this.getDataByUrl(url);
            return data;
        } catch (error) {
            this.logger.error(`"${name}" searched: ${error}`);
            return null;
        }
    }

    async getSummonerRankById(id: string): Promise<SummonerRank> {
        const url = `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}`;
        try {
            const data: LeagueEntry[] = await this.getDataByUrl(url);
            const soloRank = data.filter(
                rank => rank.queueType === QueueTypeEnum.RANKED_SOLO
            )[0];
            const flexRank = data.filter(
                rank => rank.queueType === QueueTypeEnum.RANKED_FLEX
            )[0];
            return {
                solo: {
                    tier: soloRank ? soloRank.tier : null,
                    rank: soloRank ? soloRank.rank : null,
                },
                flex: {
                    tier: flexRank ? flexRank.tier : null,
                    rank: flexRank ? flexRank.rank : null,
                },
            };
        } catch (error) {
            this.logger.error(`"${id}" searched: ${error}`);
            return null;
        }
    }
}
