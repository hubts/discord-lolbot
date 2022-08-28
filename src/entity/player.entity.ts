import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Game } from "./game.entity";
import { Summoner } from "./summoner.entity";

@Entity("player")
export class Player {
    @PrimaryGeneratedColumn()
    id: string;

    @CreateDateColumn({
        name: "created_at",
    })
    createdAt: Date;

    @Column({
        name: "team_number",
        default: 1,
    })
    teamNumber: number;

    @ManyToOne(() => Summoner, summoner => summoner.players, {
        onDelete: "SET NULL",
    })
    summoner: Summoner;

    @ManyToOne(() => Game, game => game.players, {
        onDelete: "SET NULL",
    })
    game: Game;

    @Column({
        name: "memo",
        default: "",
    })
    memo: string;

    @Column({
        name: "is_waiting",
        default: true,
    })
    isWaiting: boolean;

    @Column({
        name: "is_winner",
        default: false,
    })
    isWinner: boolean;
}
