import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authMiddleware from './middleware/auth';

dotenv.config();

connectDB();


const app = express(); 
app.use(cors());
app.use(express.json());

// Protect all routes with auth middleware
app.use('/api', authMiddleware);

// Route imports must use `.ts` extension if using ES modules, or CommonJS-style imports with allowJs
import materialRoutes from './routes/materialRoutes';
import inventoryLogRoutes from './routes/inventoryLogRoutes';
import userRoutes from './routes/userRoutes';
import activityLogRoutes from './routes/activityLogRoutes';

app.use('/api/materials', materialRoutes);
app.use('/api/inventory-logs', inventoryLogRoutes);
app.use('/api/users', userRoutes);
app.use('/api/activity-logs', activityLogRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
