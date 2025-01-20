import express from 'express'
import { BlogPost } from '../model/blogPost.js';

export const blogRoutes = express.Router();

blogRoutes.get('/', async(req,res)=>{
    try{
        const blog = await BlogPost.find();
        res.status(200).send({message:'Blogs fetched successfully', data:blog})
    }catch(error){
        res.status(400).send({message:`Blogs fetching error at backend: ${error.message}`})
    }
})

blogRoutes.post('/post-blog', async(req,res)=>{
    try{
        const data = req.body;
        const jsonSize = Buffer.byteLength(JSON.stringify(data), 'utf8');
        console.log(`Document size: ${jsonSize} bytes`);
        

        const blog = await BlogPost.create(data);
        res.status(200).send({message:'Blog created successfully', data:blog})
    }catch(error){
        res.status(400).send({message:`Blog creating error at backend: ${error.message}`})
    }
})

blogRoutes.delete('/delete-blog/:id', async(req,res)=>{
    try{
        const {id} = req.params;
        const blog = await BlogPost.findByIdAndDelete(id);
        res.status(200).send({message:'Blog deleted successfully', data:blog})
    }catch(error){
        res.status(400).send({message:`Blog deleting error at backend: ${error.message}`})
    }
})

blogRoutes.put('/update-blog/:id', async(req,res)=>{
    try{
        const {id} = req.params;
        const data = req.body;
        const blog = await BlogPost.findByIdAndUpdate(id,data);
        res.status(200).send({message:'Blog updated successfully', data:blog})
    }catch(error){
        res.status(400).send({message:`Blog updating error at backend: ${error.message}`})
    }
})

blogRoutes.put('/update-many', async(req,res)=>{
    try{
        const {user_id, data} = req.body;
        const blog = await BlogPost.updateMany( {user_id:user_id}, { $set: data });
        res.status(200).send({message:'Many Blogs updated successfully', data:blog})
    }catch(error){
        res.status(400).send({message:`Many Blogs updating error at backend: ${error.message}`})
    }
})
