import { Request, Response } from "express";
import { Post } from "../entities/Post";
import { Hashtag } from "../entities/Hashtag";
import { AppDataSource } from "../data-source";

export class PostController {
    private postRepository = AppDataSource.getRepository(Post)
    private hashtagRepository = AppDataSource.getRepository(Hashtag)

    async getPostById(req: Request, res: Response){
        try {
            const post = await this.postRepository.findOne({
            where: {id: + req.params.id},
            relations: ['user', 'hashtags', 'likes']
            });
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }
            res.json(post);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching post', error });
        }
    }

    async createPost(req: Request, res: Response) {
        try {
            const userId = +req.params.id
            const {content, hashtags} = req.body
            let hashtagEntities: Hashtag[] = [];
            if (hashtags && Array.isArray(hashtags)) {
                hashtagEntities = await Promise.all(
                    hashtags.map(async (name: string) => {
                        let tag = await this.hashtagRepository.findOneBy({ name });
                        if (!tag) {
                            tag = this.hashtagRepository.create({ name });
                            await this.hashtagRepository.save(tag);
                        }
                        return tag;
                    })
                );
            }
            
            const post = this.postRepository.create({
                userId: userId,
                content: content,
                hashtags: hashtagEntities // Link hashtags to the post
            });
            
            const result = await this.postRepository.save(post);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error creating post', error });
        }
    }

    async updatePost(req: Request, res: Response) {
        try {
            const userId = +req.params.id
            const post = await this.postRepository.findOneBy({
                id: +req.params.postId,
            });
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }
            if(post.userId !== userId){
                return res.status(403).json({message: "You are not authorized"})
            }
            this.postRepository.merge(post, req.body);
            const result = await this.postRepository.save(post);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error updating post', error });
        }
    }

    async deletePost(req: Request, res: Response) {
        try {
            const userId = +req.params.id
            const post = await this.postRepository.findOneBy({
                id: +req.params.postId,
            });
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }
            if(post.userId !== userId){
                return res.status(403).json({message: "You are not authorized"})
            }
            const result = await this.postRepository.delete(+req.params.postId);
            if (result.affected === 0) {
                return res.status(404).json({ message: 'Post not found' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting post', error });
        }
    }

    async hashtagPosts(req: Request, res:Response){
        try{
            const hashtag = req.params.hashtag as string
            const page = parseInt(req.query.page as string) || 1
            const limit = parseInt(req.query.limit as string) || 10
            const skip = (page - 1) * limit

            const [posts, total] = await this.postRepository.findAndCount({
                where: {
                    hashtags: {
                        name: hashtag
                    }
                },
                relations: ['hashtags', 'user'],
                order: {
                    createdAt: 'DESC'
                },
                take: limit,
                skip: skip
            })
            if(posts.length === 0){
                return res.status(404).json({message: "No posts are found for the hashtag"})
            }
            return res.json({
                data: posts,
                meta: {
                    totalItems: total,
                    itemCount: posts.length,
                    itemsPerPage: limit,
                    totalPages: Math.ceil(total / limit),
                    currentPage: page
                }
            });
        }catch(error){
            res.status(500).json({message: "Error fetching posts", error})
        }
    }
}
