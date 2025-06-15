import { Request, Response, NextFunction } from 'express';

export interface VersionedRequest extends Request {
  apiVersion?: string;
}

/**
 * API 버전 헤더 미들웨어
 * Accept 헤더에서 API 버전을 추출하여 request 객체에 추가
 * 예: Accept: application/vnd.api.v2+json
 */
export const versionMiddleware = (req: VersionedRequest, res: Response, next: NextFunction) => {
  const acceptHeader = req.headers.accept || '';
  
  // Accept 헤더에서 버전 추출: application/vnd.api.v2+json
  const versionMatch = acceptHeader.match(/application\/vnd\.api\.v(\d+)\+json/);
  
  if (versionMatch) {
    req.apiVersion = `v${versionMatch[1]}`;
  } else {
    // 기본 버전
    req.apiVersion = 'v1';
  }
  
  log.debug(`API Version: ${req.apiVersion} for ${req.method} ${req.path}`);
  next();
};

/**
 * 특정 버전에서만 동작하는 미들웨어 생성기
 */
export const requireVersion = (version: string) => {
  return (req: VersionedRequest, res: Response, next: NextFunction) => {
    if (req.apiVersion === version) {
      next();
    } else {
      res.status(406).json({
        error: 'API Version Not Acceptable',
        message: `This endpoint requires API version ${version}`,
        currentVersion: req.apiVersion
      });
    }
  };
};