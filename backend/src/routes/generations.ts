import { Router } from 'express';
import {
  createGeneration,
  getGenerations,
} from '../controllers/generationController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// All generation routes require authentication
router.use(authenticate);

router.post('/', upload.single('image'), createGeneration);
router.get('/', getGenerations);

export default router;
