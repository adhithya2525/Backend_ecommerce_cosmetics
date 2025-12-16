const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    firstname:String,
    lastname:String,
    phone:String,
    email:String,
    password:String,
    role:{type:String,default:'user'},
    subscription:{type:String,default:'Free'}
});
module.exports=mongoose.model('User',userSchema,'users');