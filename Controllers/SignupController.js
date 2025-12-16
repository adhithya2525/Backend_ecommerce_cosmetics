const User=require('../Models/SignupModel.js');
const signupUser=async(req,res)=>{
    try{
        const {firstname,lastname,phone,email,password}=req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({message:"User with this email already exists"});
        }
        
        const newUser=new User({
            firstname,
            lastname,
            email,
            phone,
            password,
        });
        const savedUser=await newUser.save();
        res.status(201).json({message:"User signed up successfully",user:savedUser});         
    }
    catch(err){ 
        res.status(500).json({message:"Error signing up user",error:err.message});
    }
};
module.exports={signupUser};

