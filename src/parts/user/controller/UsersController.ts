import { Controller, Get, Post, Route, Tags, Query, Path, Body, Header } from 'tsoa'
import { UserService } from '../service/user.service'

// DTO definitions for TSOA
export interface UserResponse {
    id: number
    name: string
    email: string
    createdAt: string
}

export interface UsersListResponse {
    users: UserResponse[]
    total: number
}

export interface ErrorResponse {
    msg: string
}

export interface CreateUserRequest {
    name: string
    email: string
}

export interface CreateUserResponse {
    id: number
    name: string
    email: string
    createdAt: string
    message: string
}

export interface UserResponseV2 {
    id: number
    fullName: string
    emailAddress: string
    created: string
    version: string
}

@Route('users')
@Tags('Users')
export class UsersController extends Controller {
    /**
     * Get all users
     * Returns list of users with optional key parameter
     */
    @Get('/')
    public async getUsers(@Query() key?: string): Promise<UsersListResponse | ErrorResponse> {
        if (key === 'error') {
            this.setStatus(500)
            throw new Error('key is error')
        }

        const userService = new UserService()

        try {
            const users = await userService.getAllUsers()
            return { users, total: users.length }
        } catch (error) {
            this.setStatus(500)
            throw new Error(`Failed to get users: ${error}`)
        }
    }

    /**
     * Get user by ID
     * Returns specific user information by user ID
     * Supports version negotiation via Accept header
     */
    @Get('/{userId}')
    public async getUserById(
        @Path() userId: number,
        @Header('accept') accept?: string
    ): Promise<UserResponse | UserResponseV2> {
        const userService = new UserService()

        try {
            const user = await userService.getUserById(userId)

            // 헤더 기반 버전 관리
            if (accept?.includes('application/vnd.api.v2+json')) {
                // V2 응답 형식
                return {
                    id: user.id,
                    fullName: user.name,
                    emailAddress: user.email,
                    created: user.createdAt,
                    version: 'v2',
                }
            }

            // 기본 V1 응답 형식
            return user
        } catch (error) {
            this.setStatus(404)
            throw new Error('User not found')
        }
    }

    /**
     * Create new user
     * Creates a new user in the database
     */
    @Post('/')
    public async createUser(@Body() userData: CreateUserRequest): Promise<CreateUserResponse> {
        const userService = new UserService()

        try {
            const newUser = await userService.createUser(userData)
            return {
                ...newUser,
                message: 'User created successfully',
            }
        } catch (error) {
            this.setStatus(400)
            throw new Error(`Failed to create user: ${error}`)
        }
    }
}
