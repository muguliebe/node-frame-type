export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  timestamp: string;
}

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

export interface PingResponse {
  msg: string;
}

export interface SampleInput {
  name: string;
}

export interface SampleResponse {
  msg: string;
}

export interface ErrorResponse {
  message: string;
  code?: string;
}