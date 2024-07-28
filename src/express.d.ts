// src/express.d.ts

import { Express } from 'express-serve-static-core';

declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
      files?: Express.Multer.File[];
    }
  }
}
