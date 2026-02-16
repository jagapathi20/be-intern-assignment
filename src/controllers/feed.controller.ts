import {Request, Response} from "express"
import { Post } from "../entities/Post"
import { User } from "../entities/User"
import { Like } from "../entities/Like"
import { AppDataSource } from "../data-source"
import { In } from "typeorm"

export class ActivityController{
    private postRepository = AppDataSource.getRepository(Post);
    private userRepository = AppDataSource.getRepository(User);
    private likeRepository = AppDataSource.getRepository(Like);

    async getUserFeed(req: Request, res: Response){
        try{
            const userId = +req.params.id
            const page = parseInt(req.query.page as string) || 1
            const limit = parseInt(req.query.limit as string) || 10
            const skip = (page - 1) * limit

            const followingSubQuery = await this.userRepository
                .createQueryBuilder("follow")
                .select("follw.followingId")
                .where("follow.followerId = :userId", {userId})
                .getRawMany()

            const followingIds = followingSubQuery.map(f => f.followingId)

            if(followingIds.length === 0){
                return res.json({
                    data: [],
                    meta: { totalItems: 0, itemCount: 0, itemsPerPage: limit, totalPages: 0, currentPage: page }
                });
            }

        
            const [feed, total] = await this.postRepository.findAndCount({
                where: {
                    user: {id: In(followingIds)}
                },
                relations:['user', 'hashtags'],
                order: {
                    createdAt: "DESC"
                },
                take: limit,
                skip: skip
            })

            return res.json({
                data: feed,
                meta: {
                    totalItems: total,
                    itemCount: feed.length,
                    itemsPerPage: limit,
                    totalPages: Math.ceil(total / limit),
                    currentPage: page
                }
            })
            
        }catch(error){
            return res.status(500).json({message: "Error fetching fedd", error})
        }

    }

    async getUserActivity(req: Request, res: Response){
        try{
            const userId = +req.params.id

            const postPage = parseInt(req.query.postPage as string) || 1
            const postLimit = parseInt(req.query.postLimit as string) || 10
            const postSkip = (postPage - 1) * postLimit

            const likePage = parseInt(req.query.likePage as string) || 1
            const likeLimit = parseInt(req.query.likeLimit as string) || 10
            const likeSkip = (likePage - 1) * likeLimit

            const [myPosts, totalPosts] = await this.postRepository.findAndCount({
                where: {userId},
                order: {createdAt: "DESC"},
                take: postLimit,
                skip: postSkip
            })

            const [likes, totalLikes] = await this.likeRepository.findAndCount({
                where: { userId},
                relations: ['post', 'post.user'],
                order: {createdAt: "DESC"},
                take: likeLimit,
                skip: likeSkip
            })

        
        return res.json({
            myActivity: {
                data: myPosts,
                total: totalPosts,
                page: postPage,
                totalPages: Math.ceil(totalPosts / postLimit)
            },
            likedActivity: {
                data: likes.map((like) => like.post), 
                total: totalLikes,
                page: likePage,
                totalPages: Math.ceil(totalLikes / likeLimit)
            }
        });
        }catch(error){
            return res.status(500).json({ message: 'Error fetching activity', error })
        }
    }
    
}