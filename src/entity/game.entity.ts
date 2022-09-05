import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Player } from "./player.entity";
import { Summoner } from "./summoner.entity";

@Entity("game")
export class Game {
    @PrimaryGeneratedColumn()
    id: string;

    @CreateDateColumn({
        name: "created_at",
    })
    createdAt: Date;

    @Column({
        name: "title",
    })
    title: string;

    @Column({
        name: "description",
        default: "",
    })
    description: string;

    @Column({
        name: "is_finished",
        default: false,
    })
    isFinished: boolean;

    @Column({
        name: "is_canceled",
        default: false,
    })
    isCanceled: boolean;

    @ManyToOne(() => Summoner, summoner => summoner.games, {
        onDelete: "SET NULL",
    })
    creator: Summoner;

    @OneToMany(() => Player, player => player.game, {
        nullable: true,
    })
    players: Player[];
}
