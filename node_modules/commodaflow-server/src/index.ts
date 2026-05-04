import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import hardwareRoutes from './routes/hardwareRoutes.js'; 
import rentalRoutes from './routes/rentalRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { requestLogger } from './middlewares/logger.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
const PORT = 3001;
const MONGO_URI = 'mongodb://DB_admin:zRAQ.!FpV9ktBWC@ac-d4yso1s-shard-00-00.08ospra.mongodb.net:27017,ac-d4yso1s-shard-00-01.08ospra.mongodb.net:27017,ac-d4yso1s-shard-00-02.08ospra.mongodb.net:27017/?ssl=true&replicaSet=atlas-yty30x-shard-0&authSource=admin&appName=Cluster0';

app.use(requestLogger);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api/hardware', hardwareRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/auth', authRoutes);
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CommodaFlow API is running' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Servidor de CommodaFlow en http://localhost:${PORT}`);
});

mongoose.connect(MONGO_URI)
  .then(() => console.log('🔥 ¡CONECTADO A MONGODB ATLAS (NUBE)!'))
  .catch(err => console.error('❌ Error de conexión:', err));

process.on('uncaughtException', (err) => {
  console.error('💥 uncaughtException:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('💥 unhandledRejection:', reason);
});