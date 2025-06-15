describe('/v1/sample/users', () => {
    it(`GET /sample/users with query should handle query parameters correctly`, async () => {
        const query = { key: 'value' };
        const res = await global.r.get('/v1/sample/users').query(query);

        expect(res.statusCode).toBe(200);
        console.log(`result is: ${JSON.stringify(res.body)}`)
        expect(res.body).toEqual({msg:'/users'});
    });
    it('GET /sample/users with key:error should return a 500 error and correct error message', async () => {
        const errorQuery = { key: 'error' };
        const res = await global.r.get('/v1/sample/users').query(errorQuery);

        expect(res.statusCode).toBe(500);
    });
})
