describe('/health', () => {
    it('GET /health should return health status with all services', async () => {
        const res = await global.r.get('/health')

        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('status', 'OK')
        expect(res.body).toHaveProperty('timestamp')
        expect(res.body).toHaveProperty('uptime')
        expect(res.body).toHaveProperty('version', '1.0.0')
        expect(res.body).toHaveProperty('environment')
        expect(res.body).toHaveProperty('services')
        expect(res.body.services).toHaveProperty('ping')
        expect(res.body.services).toHaveProperty('mongodb')
        expect(res.body.services).toHaveProperty('postgresql')
        expect(res.body.services.ping).toHaveProperty('msg', 'pong')
    })
})