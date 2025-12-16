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

// Environment validation
if (!process.env.MONGO_URL) {
    console.error('❌ MONGO_URL environment variable is required');
    process.exit(1);
}
if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET environment variable is required');
    process.exit(1);
}
console.log('✅ Environment variables validated');
const app=express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
// CORS configuration for production
const corsOptions = {
    origin: [
        'https://jaiadhithyak.netlify.app',
        'http://localhost:5173',
        'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Origin',
        'X-Requested-With', 
        'Content-Type',
        'Accept',
        'Authorization',
        'Cache-Control'
    ],
    optionsSuccessStatus: 200,
    preflightContinue: false
};

app.use(cors(corsOptions));

// Explicit preflight handler for all routes
app.options('*', (req, res) => {
    const origin = req.headers.origin;
    if (corsOptions.origin.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization,Cache-Control');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(200);
});
const signupRoutes=require('./Routers/SignupRoutes.js');
const loginRoutes=require('./Routers/LoginRoutes.js');
const userRoutes=require('./Routers/UserRoutes.js');
const productRoutes=require('./Routers/ProductRoutes.js');
const forgotPasswordRoutes=require('./Routers/ForgotPasswordRoutes.js');
const subscriptionRoutes=require('./Routers/SubscriptionRoutes.js');
const contactRoutes=require('./Routers/ContactRoutes.js');
const { authenticateToken, requireAdmin } = require('./auth.js');
// Health check endpoint with CORS info
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        ...DEPLOYMENT_INFO,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        cors: {
            allowedOrigins: corsOptions.origin,
            methods: corsOptions.methods
        }
    });
});

// Version endpoint
app.get('/api/version', (req, res) => {
    res.json(DEPLOYMENT_INFO);
});

// Additional CORS headers middleware
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (corsOptions.origin.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Credentials', 'true');
    console.log(`${req.method} ${req.path} - Origin: ${origin}`);
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