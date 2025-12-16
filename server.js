const mongoose=require('mongoose');
const express=require('express');
const cors=require('cors');
const cookieParser = require('cookie-parser');
const packageJson = require('./package.json');
require('dotenv').config();

// Deployment tracking
const DEPLOYMENT_INFO = {
    version: packageJson.version,
    deployedAt: new Date().toISOString(),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development'
};

console.log('🚀 Backend Deployment Info:', DEPLOYMENT_INFO);
const app=express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-frontend-domain.com', 'http://localhost:5173']
        : 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
const signupRoutes=require('./Routers/SignupRoutes.js');
const loginRoutes=require('./Routers/LoginRoutes.js');
const userRoutes=require('./Routers/UserRoutes.js');
const productRoutes=require('./Routers/ProductRoutes.js');
const forgotPasswordRoutes=require('./Routers/ForgotPasswordRoutes.js');
const subscriptionRoutes=require('./Routers/SubscriptionRoutes.js');
const contactRoutes=require('./Routers/ContactRoutes.js');
const { authenticateToken, requireAdmin } = require('./auth.js');
// Health check endpoint with version info
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        ...DEPLOYMENT_INFO,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Version endpoint
app.get('/api/version', (req, res) => {
    res.json(DEPLOYMENT_INFO);
});

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.use('/api/signup', signupRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/users', authenticateToken, requireAdmin, userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/forgot-password', forgotPasswordRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/contact', contactRoutes);

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});
mongoose.connect(process.env.MONGO_URL.replace('/?', '/beauty_DB?')).then(()=>{
    console.log("Connected to beauty_DB database");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT,()=>{   
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err)=>{
    console.log("Error connecting to MongoDB:", err);
});