const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://your-frontend-domain.vercel.app']
        : 'http://localhost:5173',
    credentials: true
}));
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/producrRoutes');
const categoryRoutes = require('./routes/category');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chatbot', chatbotRoutes);

app.get('/', (req, res) => {
    res.send('Server is running...');
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        app.listen(process.env.PORT || 5000, () => {
            console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5000}`);
        });
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error);
    });
