import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';

const app: Application = express();

//parsers
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ['https://e-com-client-phi.vercel.app'],
    credentials: true,
  }),
);

app.use('/api/v1', router);

const getController = (req: Request, res: Response) => {
  res.send('e-com app');
};

app.get('/', getController);

app.use(globalErrorHandler);

app.use(notFound);

export default app;
