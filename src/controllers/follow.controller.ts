import {Request, Response} from 'express'
import {User} from "../entities/User"
import { AppDataSource } from '../data-source'

export class FollowController {
    private userRepository = AppDataSource.getRepository(User)

    async toggleFollowUser(req: Request, res: Response){
        try{
            const userId = +req.params.id
            const followingId = +req.params.toFollowId

            if(userId === followingId){
                return res.status(400).json({ message: "You cannot follow yourself" });
            }
            const userAccount = await this.userRepository.findOne({
                where: {id: userId},
                relations: ['following']
            })
            const targetAccount = await this.userRepository.findOneBy({id: followingId})

            if(!userAccount || !targetAccount){
                return res.status(404).json({ message: "User not found" });
            }

            const isAlreadyFollowing = userAccount.following.some(user => user.id === followingId )
            if(isAlreadyFollowing){
                userAccount.following = userAccount.following.filter(user => user.id !== followingId)
                await this.userRepository.save(userAccount)
                res.status(200).json({ message: "Successfully unfollowed user" });
            }else{
                userAccount.following.push(targetAccount)
                await this.userRepository.save(userAccount)
                res.status(200).json({ message: "Successfully followed user" });
            }
        }catch(error){
            res.status(500).json({ message: "Error usersFollowing user", error });
        }
        
    }

    async getFollowers(req: Request, res: Response){
        try{
            const user = await this.userRepository.findOne({
                where: {id: +req.params.id},
                relations: ['followers']
            })

            if(!user){
                return res.status(404).json({ message: "User not found" });
            }
            res.json(user.followers)
        }catch(error){
            res.status(500).json({ message: "Error fetching followers" });
        }
    }
}