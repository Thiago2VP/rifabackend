import { Router } from 'express';
import numbersController from '../controllers/Numbers.js';

const router = new Router();

router.get('/', numbersController.index);
router.get('/:id', numbersController.show);
router.post('/', numbersController.store);
router.put('/:id', numbersController.update);
router.delete('/:id', numbersController.delete);

export default router;