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