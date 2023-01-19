import { Request, Response, Router } from 'express';
import { RequestService } from './RequestService';
import { SignUpRequest } from '../core/admin/useCases/signUp/SignUpRequest';
import { SignUpUseCase } from '../core/admin/useCases/signUp/SignUpUseCase';
import { DependencyInjector } from '../external/dependencyInjector/DependencyInjector';

const router = Router();

const dependencyInjector = new DependencyInjector();
const adminPersistence = dependencyInjector.getAdminPersistence();
const authService = dependencyInjector.getAuthService();

router.post('/sign-up/v1', async (req: Request, res: Response) => {
  await RequestService.wrapper(async () => {
    await new SignUpUseCase(adminPersistence, authService).execute(new SignUpRequest(req.body));
  }, res);
});

export const adminRouter = router;
