import { InGetByName, SampleSaveIn } from '../../../src/service/sample/sample.service'

describe('/sam', () => {
    test('GET /sam/text return ok', async () => {
        const res = await global.r.get('/sam/text')
        expect(res.statusCode).toBe(200)
        expect(res.body).toBe('good job')
    })
    test('POST /sam', async () => {
        const inPost: SampleSaveIn = {
            name: 'name',
        }
        const res = await global.r.post('/sam').send(inPost)
        expect(res.statusCode).toBe(200)
    })
    test('GET /sam', async () => {
        const inPost: InGetByName = {
            name: 'name',
        }
        const res = await global.r.get('/sam')
        expect(res.statusCode).toBe(200)
    })
    test('POST /sam return 400', async () => {
        const res = await global.r.post('/sam')
        expect(res.statusCode).toBe(400)
    })
})
