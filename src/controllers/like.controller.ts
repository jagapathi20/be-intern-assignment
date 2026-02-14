import { Request, Response } from 'express';
import { Like } from '../entities/Like';
import { AppDataSource } from '../data-source';

export class LikeController {
  private likeRepository = AppDataSource.getRepository(Like);

  async togglePostLike(req: Request, res: Response){
    try{
      const like = await this.likeRepository.findOne({
        where: {
          userId: +req.params.id,
          postId: +req.params.postId
        }
      })
  
      if(like){
        await this.likeRepository.delete(like.id)
        return res.status(204).send()
      }else{
        const newLike = this.likeRepository.create({
          userId: +req.params.id,
          postId: +req.params.postId
        })

        await this.likeRepository.save(newLike)
        return res.status(200).json({message: "post is liked successfully"})
      }
    }catch(error){
      res.status(500).json({message: "Error updating like"})
    }
  }

  async getPostLikes(req: Request, res: Response){
    try{
      const likes = await this.likeRepository.findAndCount({
        where: {
          postId: + req.params.postId
        }
      })
      return res.json({count: likes[1]})
    }catch(error){
      return res.status(500).json({message: "Error loading likes"})
    }
  }
}