describe('API Root', () => {
    it('GET / should return API information with endpoints', async () => {
        const res = await global.r.get('/')

        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('message', 'API Root')
        expect(res.body).toHaveProperty('timestamp')
        expect(res.body).toHaveProperty('version', '1.0.0')
        expect(res.body).toHaveProperty('endpoints')
        expect(res.body.endpoints).toHaveProperty('health', '/health')
        expect(res.body.endpoints).toHaveProperty('v1')
        expect(res.body.endpoints.v1).toHaveProperty('ping', '/v1/ping')
        expect(res.body.endpoints.v1).toHaveProperty('sample', '/v1/sam')
        expect(res.body.endpoints.v1).toHaveProperty('users', '/v1/sample/users')
    })
})