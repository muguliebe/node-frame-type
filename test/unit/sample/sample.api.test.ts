import {InGetByName, SampleSaveIn} from '@/service/sample/sample.service'

describe('/sam', () => {
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
    // test('PUT /sam', async () => {
    //     const inPut = {
    //         name: "jest"
    //     }
    //     const res = await global.r.put('/sam/62af1159e6de103e768b3b25').send(inPut)
    //     expect(res.statusCode).toBe(200)
    // })

    test('POST /sam return 400', async () => {
        const res = await global.r.post('/sam')
        expect(res.statusCode).toBe(400)
    })
})
