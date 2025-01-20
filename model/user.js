import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    user_image:{type:String},
    user_cover:{type:String},
})

const User = mongoose.model('User',userSchema);
export {User}