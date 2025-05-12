const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authMiddleware = require('./middleware/auth');

dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Protect all routes with auth middleware
app.use('/api', authMiddleware);

app.use('/api/materials', require('./routes/materialRoutes'));
app.use('/api/inventory-logs', require('./routes/inventoryLogRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/activity-logs', require('./routes/activityLogRoutes'));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
