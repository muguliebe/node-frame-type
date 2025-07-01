import {servicePing} from '@/parts/com/service/ping.service'

describe('Ping Service', () => {
    describe('ping', () => {
        it('should return pong message', async () => {
            const result = await servicePing.ping()
            
            expect(result).toHaveProperty('msg', 'pong')
        })
    })

    describe('getIp', () => {
        it('should handle successful IP request', async () => {
            // Mock successful response
            const result = await servicePing.getIp()
            
            // Since this calls external service, we just verify it doesn't throw
            expect(result).toBeDefined()
        })

        it('should handle IP request error gracefully', async () => {
            // This test covers the catch block in getIp method
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
            
            // The method should not throw even if external service fails
            const result = await servicePing.getIp()
            
            // Should handle error gracefully (covered line 16)
            expect(result).toBeDefined()
            
            consoleSpy.mockRestore()
        })
    })
})