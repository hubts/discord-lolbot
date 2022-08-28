import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Game } from "./game.entity";
import { Player } from "./player.entity";

@Entity("summoner")
export class Summoner {
    @PrimaryGeneratedColumn()
    id: string;

    @CreateDateColumn({
        name: "created_at",
    })
    createdAt: Date;

    @Column({
        name: "author_id",
        unique: true,
    })
    authorId: string;

    @Column({
        name: "author_name",
        unique: true,
    })
    authorName: string;

    @Column({
        name: "nickname",
        unique: true,
    })
    nickname: string;

    @Column({
        name: "main_lane",
    })
    mainLane: string;

    @Column({
        name: "sub_lane",
    })
    subLane: string;

    @OneToMany(() => Game, game => game.creator, {
        nullable: true,
    })
    games: Game[];

    @OneToMany(() => Player, player => player.summoner, {
        nullable: true,
    })
    players: Player[];
}
