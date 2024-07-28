// src/express.d.ts

import { Express } from 'express-serve-static-core';
import multer from 'multer';

declare global {
  namespace Express {
    interface Request {
      file?: multer.File;
      files?: multer.File[];
    }
  }
}
