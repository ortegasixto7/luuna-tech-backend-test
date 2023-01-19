import { Request, Response, Router } from 'express';
import { RequestService } from './RequestService';
import { SignUpRequest } from '../core/admin/useCases/signUp/SignUpRequest';
import { SignUpUseCase } from '../core/admin/useCases/signUp/SignUpUseCase';
import { SignInRequest } from '../core/admin/useCases/signIn/SignInRequest';
import { SignInUseCase } from '../core/admin/useCases/signIn/SignInUseCase';
import { CreateRequest } from '../core/admin/useCases/create/CreateRequest';
import { CreateUseCase } from '../core/admin/useCases/create/CreateUseCase';
import { UpdateRequest } from '../core/admin/useCases/update/UpdateRequest';
import { UpdateUseCase } from '../core/admin/useCases/update/UpdateUseCase';
import { DeleteRequest } from '../core/admin/useCases/delete/DeleteRequest';
import { DeleteUseCase } from '../core/admin/useCases/delete/DeleteUseCase';
import { DependencyInjector } from '../external/dependencyInjector/DependencyInjector';

const router = Router();

const dependencyInjector = new DependencyInjector();
const adminPersistence = dependencyInjector.getAdminPersistence();
const authService = dependencyInjector.getAuthService();

router.delete('/:id/v1', async (req: Request, res: Response) => {
  await RequestService.wrapper(async () => {
    req.body.userId = authService.validateTokenOrException(req.headers.authorization);
    req.body.id = req.params.id;
    await new DeleteUseCase(adminPersistence, authService).execute(new DeleteRequest(req.body));
  }, res);
});

router.put('/:id/v1', async (req: Request, res: Response) => {
  await RequestService.wrapper(async () => {
    req.body.userId = authService.validateTokenOrException(req.headers.authorization);
    req.body.id = req.params.id;
    await new UpdateUseCase(adminPersistence, authService).execute(new UpdateRequest(req.body));
  }, res);
});

router.post('/v1', async (req: Request, res: Response) => {
  await RequestService.wrapper(async () => {
    req.body.userId = authService.validateTokenOrException(req.headers.authorization);
    await new CreateUseCase(adminPersistence, authService).execute(new CreateRequest(req.body));
  }, res);
});

router.post('/sign-in/v1', async (req: Request, res: Response) => {
  await RequestService.wrapper(async () => {
    return await new SignInUseCase(authService).execute(new SignInRequest(req.body));
  }, res);
});

router.post('/sign-up/v1', async (req: Request, res: Response) => {
  await RequestService.wrapper(async () => {
    await new SignUpUseCase(adminPersistence, authService).execute(new SignUpRequest(req.body));
  }, res);
});

export const adminRouter = router;
