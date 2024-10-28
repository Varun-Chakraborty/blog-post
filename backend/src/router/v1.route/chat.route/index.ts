import { Router } from 'express';

const router = Router();

import { chatController } from '@/controllers';
import { ApiResponse } from '@/utils';

router.get('/:id', chatController.getChatById);
router.post('/create', chatController.createChat);
router.get('/preview/:id', chatController.getChatPreviewById);

router.get('*path', (_, res) =>
  new ApiResponse(
    'API v1.0\nAvailable Sub-Routes:\n- ./:id\n- ./create\n',
    undefined,
    404
  ).error(res)
);

export default router;
