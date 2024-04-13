describe('/sample/users', () => {
    it(`GET /sample/users with query should handle query parameters correctly`, async () => {
        const query = { key: 'value' };
        const res = await global.r.get('/sample/users').query(query);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({msg:'/users'});
    });
})
