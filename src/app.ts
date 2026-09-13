import express, { type Express, type Request, type Response } from 'express';
import volunteerRouter from "./routes/volunteerRoutes.ts";
const app: Express = express();

app.use(express.json());
app.use('/api/volunteers', volunteerRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('volunteer-api running');
});

export default app;



