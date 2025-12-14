import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/error.js';
import subscriptionRoutes from './routes/subscriptionRoute.js';
import webhookRoutes from './routes/webhookRoutes.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

app.use('/api/webhooks', webhookRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/subscriptions', subscriptionRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

export default app;