import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity("game")
export class Game {
    @PrimaryGeneratedColumn()
    id: string;

    @CreateDateColumn({
        name: "created_at",
    })
    createdAt: Date;

    @Column({
        name: "user_id_created_by",
    })
    userIdCreatedBy: string;

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
        name: "user_id_entries",
        type: "text",
        array: true,
        default: [],
    })
    userIdEntries: string[];
}
