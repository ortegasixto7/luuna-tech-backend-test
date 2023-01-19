import { Request, Response, Router } from 'express';
import { RequestService } from './RequestService';
import { CreateRequest } from '../core/product/useCases/create/CreateRequest';
import { CreateUseCase } from '../core/product/useCases/create/CreateUseCase';
import { DependencyInjector } from '../external/dependencyInjector/DependencyInjector';

const router = Router();

const dependencyInjector = new DependencyInjector();
const adminPersistence = dependencyInjector.getAdminPersistence();
const productPersistence = dependencyInjector.getProductPersistence();

const authService = dependencyInjector.getAuthService();

router.post('/v1', async (req: Request, res: Response) => {
  await RequestService.wrapper(async () => {
    req.body.userId = authService.validateTokenOrException(req.headers.authorization);
    await new CreateUseCase(productPersistence, adminPersistence).execute(new CreateRequest(req.body));
  }, res);
});

export const productRouter = router;
