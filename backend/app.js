import express from 'express';
const app = express();
import cors from 'cors';
import authRoutes from './routes/auth.js';
import landRoutes from './routes/land.js';
import dotenv from 'dotenv';
dotenv.config();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/land', landRoutes);

app.listen(process.env.PORT|| 5000, () => {
    console.log(`Server started on port ${process.env.PORT || 5000}`);
});