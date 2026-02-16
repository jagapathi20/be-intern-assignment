import { Request, Response } from 'express';
import { Like } from '../entities/Like';
import { AppDataSource } from '../data-source';

export class LikeController {
  private likeRepository = AppDataSource.getRepository(Like);

  async getLikebyId(req: Request, res: Response){
    try{
      const like = await this.likeRepository.findOne({
        where: {id : + req.params.likeId}
      })
      if(!like){
        return res.status(404).json({message: "Like not found"})
      }
      res.json(like)
    }catch(error){
      res.status(500).json({message: "Error fetching like"})
    }
  }

  async createLike(req: Request, res: Response){
    try{
      const userId = +req.params.id
      const postId = +req.params.postId
      const like = this.likeRepository.create({
        userId: userId,
        postId: postId
      })
      const result = await this.likeRepository.save(like)
      res.status(201).json(result)
    }catch(error){
      res.status(500).json({ message: "Error creating Like"})
    }
  }

  async deleteLike(req: Request, res: Response){
    try{
      const userId = + req.params.id
      const likeId = + req.params.likeId

      const like = await this.likeRepository.findOneBy({
        id: likeId
      })
      if(!like){
        return res.status(404).json({message: "Like not found"})
      }

      if(like.userId !== userId){
        return res.status(403).json({message: "You are not authorized"})
      }
      const result = await this.likeRepository.delete(likeId)
      if(result.affected === 0){
        return res.status(404).json({message: "Like not found"})
      }
      res.status(204).send()
    }catch(error){
      res.status(500).json({ message: 'Error deleting like', error });
    }
  }

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