describe('/ping', () => {
    it(`GET /ping return ok and msg 'pong'`, async () => {
        const res = await global.r.get('/ping')

        expect(res.statusCode).toBe(200)
        expect(res.body.msg).toBe('pong')
    })
    it(`POST /ping get IP`, async () => {
        const res = await global.r.post('/ping')

        expect(res.statusCode).toBe(200)
    })
})
