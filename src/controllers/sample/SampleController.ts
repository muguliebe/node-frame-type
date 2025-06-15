import { Controller, Get, Post, Route, Tags, Body } from 'tsoa';

export interface SampleResponse {
  msg: string;
}

export interface SampleInput {
  name: string;
}

@Route('samples')
@Tags('Sample')
export class SampleController extends Controller {
  /**
   * Get sample data
   * Returns sample response data
   */
  @Get('/')
  public async getSample(): Promise<SampleResponse> {
    return { msg: 'v2' };
  }

  /**
   * Create sample data
   * Creates new sample data with provided input
   */
  @Post('/')
  public async createSample(@Body() input: SampleInput): Promise<SampleResponse> {
    return { msg: `Created sample: ${input.name}` };
  }
}