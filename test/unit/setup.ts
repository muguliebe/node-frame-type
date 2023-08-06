import mongoose from 'mongoose'
import request from 'supertest'
import app from '@/server'

beforeAll(async () => {
    global.r = await request(app)
})
afterAll(async () => {
    await mongoose.connection.close(true)
})
