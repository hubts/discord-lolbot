import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity("summoner")
export class Summoner {
    @PrimaryGeneratedColumn()
    id: string;

    @CreateDateColumn({
        name: "created_at",
    })
    createdAt: Date;

    @Column({
        name: "user_id",
        unique: true,
    })
    userId: string;

    @Column({
        name: "username",
        unique: true,
    })
    username: string;

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
}
