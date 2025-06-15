import {InGetByName, SampleSaveIn} from '@/service/core/sample/sample.service'

describe('/v1/sam', () => {
    test('POST /sam', async () => {
        const inPost: SampleSaveIn = {
            name: 'name',
        }
        const res = await global.r.post('/v1/sam').send(inPost)
        expect(res.statusCode).toBe(200)
    })
    test('GET /sam', async () => {
        const inPost: InGetByName = {
            name: 'name',
        }
        const res = await global.r.get('/v1/sam')
        expect(res.statusCode).toBe(200)
    })
    // test('PUT /sam', async () => {
    //     const inPut = {
    //         name: "jest"
    //     }
    //     const res = await global.r.put('/v1/sam/62af1159e6de103e768b3b25').send(inPut)
    //     expect(res.statusCode).toBe(200)
    // })

    test('POST /sam return 400', async () => {
        const res = await global.r.post('/v1/sam')
        expect(res.statusCode).toBe(400)
    })
})
