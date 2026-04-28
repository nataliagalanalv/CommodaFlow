import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hardwareRoutes from './routes/hardwareRoutes.js'; 
import rentalRoutes from './routes/rentalRoutes.js';
import { requestLogger } from './middlewares/logger.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
const PORT = 3001;

app.use(requestLogger);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api/hardware', hardwareRoutes);
app.use('/api/rentals', rentalRoutes);
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CommodaFlow API is running' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Servidor de CommodaFlow en http://localhost:${PORT}`);
});

process.on('uncaughtException', (err) => {
  console.error('💥 uncaughtException:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('💥 unhandledRejection:', reason);
});