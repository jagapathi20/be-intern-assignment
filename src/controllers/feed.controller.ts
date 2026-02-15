import {Request, Response} from "express"
import { Post } from "../entities/Post"
import { User } from "../entities/User"
import { Like } from "../entities/Like"
import { AppDataSource } from "../data-source"
import { In } from "typeorm"

export class AcitivityController{
    private postRepository = AppDataSource.getRepository(Post);
    private userRepository = AppDataSource.getRepository(User);
    private likeRepository = AppDataSource.getRepository(Like);

    async getUserFeed(req: Request, res: Response){
        try{
            const userId = +req.params.id

            const user = await this.userRepository.findOne({
                where: {id: userId},
                relations: ['following']
            })

            if(!user){
                return res.status(404).json({message: "User not found"})
            }

            const followingIds = user.following.map((followedUser) => followedUser.id)

            if(followingIds.length === 0){
                return res.json([])
            }

            const feed = await this.postRepository.find({
                where: {
                    userId: In(followingIds)
                },
                relations: ['user', 'hashtags'],
                order: {
                    createdAt: "DESC"
                },
                take: 50
            })
            return res.json(feed)
        }catch(error){
            return res.status(500).json({message: "Error fetching fedd", error})
        }

    }

    async getUserActivity(req: Request, res: Response){
        try{
            const userId = +req.params.id

            const myPosts = await this.postRepository.find({
                where: {userId},
                order: {createdAt: "DESC"}
            })

            const likedActivities = await this.likeRepository.find({
                where: {userId},
                relations: ['post', 'post.user'],
                order: {createdAt: "DESC"}
            })

            return res.json({
                postCout: myPosts.length,
                recentPosts: myPosts.slice(0, 10),
                likedPosts: likedActivities.map((like) => like.post)
            })
        }catch(error){
            return res.status(500).json({ message: 'Error fetching activity', error })
        }
    }
    
}