import compression from 'compression';
import cors from 'cors';
import express, { Response, Router } from 'express';
import morgan from 'morgan';
import { MongoDbClient } from './persistence/mongoDb/MongoDbClient';

// Uncomment in local development
// import * as dotenv from 'dotenv';
// dotenv.config();

MongoDbClient.initDb()
  .then(async () => {
    const { adminRouter } = await import('./routes/adminRouter');
    const { productRouter } = await import('./routes/productRouter');

    const app = express();
    app.use(morgan('dev'));
    app.use(express.json({ limit: '1mb' }));
    app.use(compression());
    app.use(cors());

    app.use(function (req, _, next) {
      if (!req.body.password) console.info(`REQUEST_BODY: ${JSON.stringify(req.body)}`);
      next();
    });

    const router = Router();

    router.get('/', (_, res: Response) => {
      res.status(200).json({ msg: 'API is working' });
    });

    router.use('/api/admins', adminRouter);
    router.use('/api/products', productRouter);
    app.use(router);

    app.listen(process.env.PORT, () => {
      console.log(`-------\n App listening on port => ${process.env.PORT}\n-------`);
    });
  })
  .catch((err) => console.error(err));
