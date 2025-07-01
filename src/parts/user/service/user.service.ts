import { User, IUser } from '@/models/mongodb/User.model'
import { UserResponse, CreateUserRequest } from '../dto/user.dto'

export class UserService {
    /**
     * 모든 사용자 조회
     */
    async getAllUsers(): Promise<UserResponse[]> {
        try {
            const users = await User.find({}).sort({ createdAt: -1 }).exec()

            return users.map(user => ({
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                createdAt: user.createdAt.toISOString(),
            }))
        } catch (error) {
            log.error('Error fetching users:', error)
            throw new Error('Failed to fetch users')
        }
    }

    /**
     * ID로 특정 사용자 조회
     */
    async getUserById(userId: number | string): Promise<UserResponse> {
        try {
            const user = await User.findById(userId).exec()

            if (!user) {
                throw new Error('User not found')
            }

            return {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                createdAt: user.createdAt.toISOString(),
            }
        } catch (error) {
            log.error(`Error fetching user ${userId}:`, error)
            throw error
        }
    }

    /**
     * 새 사용자 생성
     */
    async createUser(userData: CreateUserRequest): Promise<UserResponse> {
        try {
            // 이메일 중복 체크
            const existingUser = await User.findOne({ email: userData.email }).exec()
            if (existingUser) {
                throw new Error('User with this email already exists')
            }

            const newUser = new User({
                name: userData.name,
                email: userData.email,
            })

            const savedUser = await newUser.save()

            log.info(`User created successfully: ${savedUser._id}`)

            return {
                id: savedUser._id.toString(),
                name: savedUser.name,
                email: savedUser.email,
                createdAt: savedUser.createdAt.toISOString(),
            }
        } catch (error) {
            log.error('Error creating user:', error)

            // MongoDB 중복 키 에러 처리
            if ((error as any).code === 11000) {
                throw new Error('User with this email already exists')
            }

            throw error
        }
    }

    /**
     * 사용자 정보 업데이트
     */
    async updateUser(userId: string, updateData: Partial<CreateUserRequest>): Promise<UserResponse> {
        try {
            const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
                new: true,
                runValidators: true,
            }).exec()

            if (!updatedUser) {
                throw new Error('User not found')
            }

            log.info(`User updated successfully: ${updatedUser._id}`)

            return {
                id: updatedUser._id.toString(),
                name: updatedUser.name,
                email: updatedUser.email,
                createdAt: updatedUser.createdAt.toISOString(),
            }
        } catch (error) {
            log.error(`Error updating user ${userId}:`, error)
            throw error
        }
    }

    /**
     * 사용자 삭제
     */
    async deleteUser(userId: string): Promise<boolean> {
        try {
            const deletedUser = await User.findByIdAndDelete(userId).exec()

            if (!deletedUser) {
                throw new Error('User not found')
            }

            log.info(`User deleted successfully: ${userId}`)
            return true
        } catch (error) {
            log.error(`Error deleting user ${userId}:`, error)
            throw error
        }
    }
}
