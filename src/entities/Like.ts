import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
  } from 'typeorm';
  import { User } from './User';
  import { Post } from './Post';
  
  @Entity('likes')
  @Index(['userId', 'postId'], { unique: true }) // Prevent duplicate likes
  export class Like {
    @PrimaryGeneratedColumn('increment')
    id: number;
  
    @Column()
    userId: number;
  
    @Column()
    postId: number;
  
    @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;
  
    @ManyToOne(() => Post, (post) => post.likes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'postId' })
    post: Post;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }