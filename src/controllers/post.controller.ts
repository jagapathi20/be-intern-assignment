import { Request, Response } from "express";
import { Post } from "../entities/Post";
import { AppDataSource } from "../data-source";

export class PostController {
    private postRepository = AppDataSource.getRepository(Post)

    async getPostById(req: Request, res: Response){
        try {
            const post = await this.postRepository.findOneBy({
            id: +req.params.id,
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
            const {content} = req.body
            const post = this.postRepository.create({
                userId: userId,
                content: content
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
            const posts = await this.postRepository.find({
                where: {
                    hashtags: {
                        name: hashtag
                    }
                },
                relations: ['hashtags', 'user'],
                order: {
                    createdAt: 'DESC'
                }
            })
            if(posts.length === 0){
                return res.status(404).json({message: "No posts are found for the hashtag"})
            }
            res.json(posts)
        }catch(error){
            res.status(500).json({message: "Error fetching posts", error})
        }
    }
}
