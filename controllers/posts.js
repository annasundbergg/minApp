const express = require('express');
const router = express.Router();
const Post = require('./../models/posts');
const slugify = require('slugify');


// Get all posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.getAll();
    res.render('posts/index', { posts: posts} )
    // res.json(posts);
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//CREATE POST
router.get('/posts/create', (req, res) => {
  res.render('posts/create')
})

router.post('/posts', async (req, res) => {
  try{
    const title = req.body.title;
    const content = req.body.content;
    const slug = slugify(title);
    const post = new Post({title, slug, content});
    await post.create();
    console.log('post created')
    console.log(post); 

    res.redirect('posts');
  }catch (err){
    console.log(err)
  }

})


// READ

router.get('/posts/slug/:slug', async (req, res) => {
  const slug = req.params.slug;

  try {
      const [post] = await Post.getBySlug(slug);

      res.render('posts/show', {
          post: post
      })
  } catch (err) {
      res.status(500).json({
          message: err.message
      });
  }
})

// DELETE



module.exports = router;