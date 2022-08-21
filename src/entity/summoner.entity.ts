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
    })
    userId: string;

    @Column({
        name: "username",
    })
    username: string;

    @Column({
        name: "nickname",
    })
    nickname: string;

    @Column({
        name: "first_lane",
    })
    firstLane: string;

    @Column({
        name: "second_lane",
    })
    secondLane: string;

    @Column({
        name: "third_lane",
    })
    thirdLane: string;

    public static of(params: Partial<Summoner>): Summoner {
        const summoner = new Summoner();
        Object.assign(summoner, params);
        return summoner;
    }
}
