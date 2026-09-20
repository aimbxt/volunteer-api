import express, { type Express, type Request, type Response } from 'express';
import volunteerRouter from "./routes/volunteerRoutes.ts";
import shiftRouter from "./routes/shiftRoutes.ts";
import signupRouter from "./routes/signupRoutes.ts";
import authRouter from "./routes/authRoutes.ts";
import { errorHandler } from './middleware/errorHandler.ts';
const app: Express = express();

app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/volunteers', volunteerRouter);
app.use('/api/shifts', shiftRouter);
app.use('/api/signups', signupRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('volunteer-api running');
});

app.use(errorHandler);

export default app;



