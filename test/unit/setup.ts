// @ts-ignore
import mongoose from 'mongoose'
import app from '../../src/server'
import request from 'supertest'

beforeAll(async () => {
    global.r = await request(app)
})
afterAll(async () => {
    await mongoose.connection.close(true)
})
