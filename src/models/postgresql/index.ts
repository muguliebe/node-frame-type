// PostgreSQL models will be added here
// Example structure for future PostgreSQL integration

export interface UserPG {
    id: number
    email: string
    name: string
    created_at: Date
    updated_at: Date
}

export interface SamplePG {
    id: number
    name: string
    day: string
    time: string
    created_at: Date
    updated_at: Date
}
