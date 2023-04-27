const express = require('express');
const endpoints = express.Router();
const connection = require('./../db_connection');
const Post = require('./../models/posts');


endpoints.get('/api/getfavoritecolor', (req, res) => {
    if (req.session.authenticated && req.session.username) {

        connection.query(`SELECT * FROM users WHERE name='${req.session.username}'`, function (error, results, fields) {
            if (error) throw error;

            if(results.length > 0){
                const data = {"color": results[0].favorite_color}
                res.json(data);
            }else{
                // res.send('Found no users')
            }

        });

    }else {
        res.redirect('/login');
    }
})

endpoints.get("/api/getAllPosts", async (req, res) => {
    try{
        const posts = await Post.getAll();
        res.json({
            posts: posts
        });
    }
    catch(err){
        res.status(500).json({
            message: err.message
        });
    }   
})

endpoints.get("/api/getPostBySlug/:slug", async (req, res) => {
    const slug = req.params.slug;

    try {
        const [post] = await Post.getBySlug(slug);
  
        res.json({
            posts: post
        });
        
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    } 
})

module.exports = endpoints;