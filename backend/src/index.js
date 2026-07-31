import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './models/index.js';
import './models/user.model.js';
import './models/song.model.js';
import './models/like.model.js';
import './models/comment.model.js';
import './models/playlist.model.js';
import songRoutes from './routes/song.routes.js';
import authRoutes from './routes/auth.routes.js';
import interactionRoutes from './routes/interaction.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/interactions', interactionRoutes);

// Test Sequelize connection and sync DB
const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database via Sequelize!');
    // Automatically create tables based on models (Sync)
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
  }
};

app.listen(PORT, async () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  await testDbConnection();
});
