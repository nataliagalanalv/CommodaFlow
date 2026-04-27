import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hardwareRoutes from './routes/hardwareRoutes.js'; 
import rentalRoutes from './routes/rentalRoutes.js';

const app = express();
const PORT = 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api/hardware', hardwareRoutes);
app.use('/api/rentals', rentalRoutes);
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CommodaFlow API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor de CommodaFlow en http://localhost:${PORT}`);
});