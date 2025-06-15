import { Controller, Get, Route, Tags } from 'tsoa';

export interface HealthResponse {
  status: 'OK' | 'ERROR';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  services: {
    ping: {
      msg: string;
    };
    mongodb: boolean;
    postgresql: boolean;
  };
}
import { servicePing } from '@/service/core/ping.service';

@Route('health')
@Tags('Health')
export class HealthController extends Controller {
  /**
   * Get system health status
   * Returns comprehensive health information including service status and connectivity
   */
  @Get('/')
  public async getHealth(): Promise<HealthResponse> {
    const pingResult = await servicePing.ping();
    
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        ping: pingResult,
        mongodb: process.env.MONGO_CONNECTED === 'true',
        postgresql: !!process.env.PG_HOST
      }
    };
  }
}