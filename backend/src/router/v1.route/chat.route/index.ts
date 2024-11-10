import { Router } from 'express';

const router = Router();

import { chatController } from '@/controllers';
import { ApiResponse } from '@/utils';

router.get('/:chatId', chatController.getChatById);
router.post('/create', chatController.createChat);
router.get('/preview/:chatId', chatController.getChatPreviewById);

router.get('*path', (_, res) =>
  new ApiResponse(
    'API v1.0\nAvailable Sub-Routes:\n- ./:chatId\n- ./create\n- ./preview/:chatId\n',
    undefined,
    404
  ).error(res)
);

export default router;
