const mongoose=require('mongoose');
const express=require('express');
const cors=require('cors');
require('dotenv').config();
const app=express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',
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
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.use('/api/signup', signupRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/forgot-password', forgotPasswordRoutes);
app.use('/api/subscription', subscriptionRoutes);

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});
mongoose.connect(process.env.MONGO_URL.replace('/?', '/beauty_DB?')).then(()=>{
    console.log("Connected to beauty_DB database");
}).catch((err)=>{
    console.log("Error connecting to MongoDB:", err);
});
app.listen(5000,()=>{   
    console.log("Server is running on port 5000");
});