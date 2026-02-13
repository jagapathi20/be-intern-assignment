import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    Index,
    JoinColumn,
    OneToMany,
    ManyToMany
} from "typeorm"
import {User} from "./User"
import { Like } from "./Like"
import { Hashtag } from "./Hashtag";

@Entity("posts")
@Index(['userId', 'createdAt'])
export class Post {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({type: "text"})
    content: String;

    @Column()
    userId: number;

    @ManyToOne(() => User, (user) => user.id, {onDelete: "CASCADE"})
    @JoinColumn({name: "userId"})
    user: User;

    @OneToMany(() => Like, (like) => like.post)
    likes: Like[];

    @ManyToMany(() => Hashtag, (hashtag) => hashtag.posts)
    hashtags: Hashtag[]; 

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}