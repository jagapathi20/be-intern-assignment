import {Request, Response} from 'express'
import {User} from "../entities/User"
import { AppDataSource } from '../data-source'
import { Follow } from '../entities/Follow'

export class FollowController {
    private userRepository = AppDataSource.getRepository(User)
    private followRepository = AppDataSource.getRepository(Follow)

    async getFollowById(req: Request, res: Response){
        try {
            const follow = await this.followRepository.findOne({
            where: {id: + req.params.id},
            relations: ['follower', 'following']
            });
            if (!follow) {
                return res.status(404).json({ message: 'follow not found' });
            }
            return res.json(follow);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching follow', error });
        }
    }

    async createFollow(req: Request, res: Response) {
        try {
            const userId = +req.params.id
            const followingId = + req.params.followingId
            const user = await this.userRepository.findOneBy({id: userId})
            const following = await this.userRepository.findOneBy({id: followingId})
            if(!user || !following){
                return res.status(404).json({message: "user not found"})
            }
            const follow = await this.followRepository.create({
                follower: user,
                following: following
            });
            const result = await this.followRepository.save(follow);
            return res.status(201).json(result);
        } catch (error) {
            return res.status(500).json({ message: 'Error creating follow', error });
        }
    }

    async deleteFollowById(req: Request, res: Response){
        try {
            const userId = +req.params.id
            const followId = + req.params.followId
            const follow = await this.followRepository.findOne({
            where: {id: followId},
            relations:['follower']
            });
            if (!follow) {
                return res.status(404).json({ message: 'follow not found' });
            }
            if(follow.follower.id !== userId){
                return res.status(403).json({message: "you are not authorized"})
            }
            const result = await this.followRepository.delete(follow)
            if(result.affected === 0){
                return res.status(404).json({message: "Follow not found"})
            }
            return res.status(204).send()
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching follow', error });
        }
    }



    async toggleFollowUser(req: Request, res: Response){
        try{
            const userId = +req.params.id
            const followingId = +req.params.toFollowId

            if(userId === followingId){
                return res.status(400).json({ message: "You cannot follow yourself" });
            }

            const userAccount = await this.userRepository.findOneBy({id: userId})
            const targetAccount = await this.userRepository.findOneBy({id: followingId})

            if(!userAccount || !targetAccount){
                return res.status(404).json({ message: "User not found" });
            }
            
            const existingFollow = await this.followRepository.findOne({
                where: {
                    follower: {id: userId},
                    following: {id: followingId}
                }
            })

            if(existingFollow){
                await this.followRepository.remove(existingFollow)
                return res.status(200).json({ message: "Successfully unfollowed user" });
            }else{
                const newFollow = this.followRepository.create({ 
                    follower: userAccount, 
                    following: targetAccount})
                await this.followRepository.save(newFollow)
                return res.status(200).json({ message: "Successfully followed user" });
            }
        }catch(error){
            return res.status(500).json({ message: "Error toggling follow ", error });
        }
        
    }

   
    async getFollowers(req: Request, res: Response) {
        try {
            const userId = +req.params.id;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;
        
                    // Check if user exists first
            const userExists = await this.userRepository.findOneBy({ id: userId });
                if (!userExists) {
                    return res.status(404).json({ message: "User not found" });
                }
        
            const [follows, totalFollowers] = await this.followRepository.findAndCount({
                where: { following: { id: userId } },
                    relations: ['follower'],
                    order: { createdAt: "DESC" },
                    take: limit,
                    skip: skip
                });
        
            res.json({
                 data: follows.map(f => f.follower),
                meta: {
                    totalFollowers: totalFollowers,
                    itemCount: follows.length,
                    itemsPerPage: limit,
                    totalPages: Math.ceil(totalFollowers / limit),
                    currentPage: page
                }
            });
        } catch (error) {
            res.status(500).json({ message: "Error fetching followers", error });
        }
    }
}