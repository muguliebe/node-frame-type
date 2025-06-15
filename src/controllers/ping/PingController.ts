import { Controller, Get, Post, Route, Tags } from 'tsoa';

export interface PingResponse {
  msg: string;
}
import { servicePing } from '@/service/core/ping.service';

@Route('ping')
@Tags('Ping')
export class PingController extends Controller {
  /**
   * Ping endpoint
   * Simple ping endpoint that returns pong
   */
  @Get('/')
  public async ping(): Promise<PingResponse> {
    const result = await servicePing.ping();
    return result;
  }

  /**
   * Get external IP
   * Returns the server's external IP address
   */
  @Post('/')
  public async getExternalIp(): Promise<{ ip: string }> {
    const result = await servicePing.getIp();
    return { ip: result || 'unknown' };
  }
}