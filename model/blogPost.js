import mongoose from "mongoose";


const blogPostSchema = mongoose.Schema({
    user_id: {type:String},
    user_name: {type:String},
    user_image: {type:String},
    title:{type:String},
    summary:{type:String},
    blog_content:{type:String},
    blog_comments:[
        {
            commenter_name: {type:String},
            comment: {type:String},
            commenter_image: {type:String},
        }
    ],
    thumbnail:{type:String},
    category:{type:String},
},{ timestamps: true })

const BlogPost = mongoose.model('BlogPost',blogPostSchema);
export {BlogPost}