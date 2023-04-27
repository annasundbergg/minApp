const express = require("express");
const router = express.Router();
const connection = require('../db_connection');
const authMiddleware = require('./../middlewares/auth');
require('dotenv').config();

router.get("/", (req, res) => {
    const data = {
        title: "Welcome",
        style: "color: lightpink",
        // href: "./views/html/login.html"
        href: "/login",
        // favCol: favoriteColor
    }
    //filen heter index
    res.render('index', data);

    // res.sendFile(__dirname + "/views/html/index.html");
});

module.exports = router;

router.get('/test', authMiddleware, (req, res) =>{ 
    console.log(req.session)
    if(req.isAuthenticated){
        res.send('logged in'); 
    }else{
        res.send('not logged in')
    }
}); 

router.get('/logged-in', authMiddleware, (req, res) =>{
    if(req.session.authenticated){
        const username = req.session.username;
        const favoriteColor = req.session.favorite_color;
        // res.sendFile(__dirname + "/views/html/logged-in.html");
        const data = {
            // name: 'Anna',
            name: username,
            // style: 'color: peachpuff'
            style: `color: ${favoriteColor}`,
        }

        res.render('logged-in', data)
        }
        
        else{
            res.redirect('/login');
        }
})

// router.post("/logged-in", (req, res) => {
//     console.log(req.session.id)

//     const { content, title } = req.body;
//     const slug = "hej";

//     // Insert new post into MySQL database
//     connection.query('INSERT INTO posts SET ?', user, (err, results) => {
//         if (err) {
//             console.error('Error creating new user: ', err);
//             res.status(500).send('Error creating new user');
//             return;
//         }
//         console.log('New user created with id: ', results.insertId);
//         req.session.username = user.name;
//         req.session.authenticated = true;
//         res.redirect('/logged-in');
//     });

// })

router.post("/login", (req, res) => {
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;

    connection.query(
        ` SELECT * FROM users WHERE email = '${email}' AND password= ${password} `,
        function (error, results, fields) {
            if (error) throw error;

            if (results.length > 0 ){
                console.log(results[0].name);
                console.log(results[0].id)
                console.log(req.session);
                //res.send(`Found ${results.length} user`);
                req.session.username = results[0].name;
                req.session.favorite_color = results[0].favorite_color;
                req.session.authenticated = true;
                req.session.id = results[0].id;
                res.redirect('/logged-in');
            }

            else{
                res.send('No users found')
            }
            console.log(results);
        }
    );

});

router.get("/login", (req, res) => {
    console.log(req.body);
    res.render('login'); 

});

// SIGN UP
router.get('/signup', (req, res) => {
    res.render('signup')
})

// Route for creating a new user
router.post('/users', (req, res) => {
    const { name, email, password, favorite_color } = req.body;
    const user = { name, email, password, favorite_color };

    // Insert new user into MySQL database
    connection.query('INSERT INTO users SET ?', user, (err, results) => {
        if (err) {
            console.error('Error creating new user: ', err);
            res.status(500).send('Error creating new user');
            return;
        }
        console.log('New user created with id: ', results.insertId);
        req.session.username = user.name;
        req.session.authenticated = true;
        res.redirect('/logged-in');
    });
});


router.get("/second", (req, res) => {
    res.send("Hello Second World!");
});


router.get('/logout', (req, res) => {
    if(req.session.authenticated && req.session.username){
        req.session.authenticated = false;
        req.session.username = null;
        res.redirect('/');

    }
        
    else{
        res.redirect('/login');
    }
})