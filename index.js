//detta är ett exempel från express documentation, om man skriver "node index.js" i terminalen så kan man gå till localhost:3000 i browsern, så kommer denna sida upp:

const express = require("express");
const app = express();
const port = 3000;
var mysql = require("mysql");
//installerar (npm i) express-session för att kunna hantera vår session
const session = require('express-session'); 
//body-parser här nedan är inbyggt i express och gör om body till json
let bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
require('dotenv').config();

app.use(
    session({
        secret: 'my-secret',
        resave: false,
        saveUninitialized: true
    })
);

const connection = require('./db_connection');

//ROUTING
const router = require('./routes/routes')
app.use(router); 


//nedan rad för att vi ska kunna länka till css i html utan att länka via olika mappar.
app.use(express.static("public"));

//Set EJS as the view engine
app.set('view engine', 'ejs');

//specify the location of the of the view folder
app.set('views', './views')

//allt man skriver i URL-fältet blir en get-request

//get hämtar nånting, post postar, put ändrar, delete tar bort
//get här nedan är en funktion som ligger i express-ramverket.
// man kan ej ha två GET som lyssnar på samma, så kommenterar ut detta för att göra rad 27.
// app.get('/', (req, res) => {
//     console.log(req); //visar massa grejer i terminalen, ej i konsollen i browserns
//     res.send('Hello World!')
// })

// app.get("/second", (req, res) => {
//     res.send("Hello Second World!");
// });

//lägger in i routes.js 
// app.get("/", (req, res) => {
//     const data = {
//         title: "Welcome",
//         style: "color: lightpink",
//         // href: "./views/html/login.html"
//         href: "/login"
//     }
//     //filen heter index
//     res.render('index', data);

//     // res.sendFile(__dirname + "/views/html/index.html");
// });

// app.get('/api/getuser', (req, res) => {
//     res.json('{"name": "Anna"}');
// }) vi byter detta till att hämta favoritecolor istället:


// app.get('/logged-in', (req, res) =>{
//     if(req.session.authenticated){
//         const username = req.session.username;
//         const favoriteColor = req.session.favorite_color;
//         // res.sendFile(__dirname + "/views/html/logged-in.html");
//         const data = {
//             // name: 'Anna',
//             name: username,
//             // style: 'color: peachpuff'
//             style: `color: ${favoriteColor}`,
//         }

//         res.render('logged-in', data)
//         }
        
//         else{
//             res.redirect('/login');
//         }
// })

app.get('/api/getFavoriteColor', (req, res) => {
    // res.json(`{"color": '${favoriteColor}'}`);
if(req.session.authenticated && req.session.username)
{
    connection.query(

        ` SELECT * FROM users WHERE name = '${req.session.username}'`,
        function (error, results, fields) {
            if (error) throw error;

            if (results.length > 0 ){
                console.log(results[0].favorite_color);
                res.json(`{"color": ${results[0].favorite_color}}`);
            }
        }
    );
}
else{
    res.redirect('/login'); 
}

})

//i package.json under scripts skriver vi bara olika kommandon som förenklar för oss. T ex "start": "nodemon index.js" gör att vi använder vår dependency nodemon som uppdaterar vår kod hela tiden utan att vi behöver cancel och run igen. Man kan även använda det om man t ex vill kompilera flera ccs filer osv.

//databas connection. Nu har vi kört npm install mysql för att göra detta
// var connection = mysql.createConnection({
//     host: "localhost",
//     port: 8889,
//     user: "admin",
//     password: "password",
//     database: "express-demo",
// }); vi kommenterar bort detta för att kunna hosta 


// app.post("/login", (req, res) => {
//     const email = req.body.email;
//     const password = req.body.password;

//     connection.query(
//         ` SELECT * FROM users WHERE email = '${email}' AND password= ${password} `,
//         function (error, results, fields) {
//             if (error) throw error;

//             if (results.length > 0 ){
//                 console.log(results[0].name);
//                 //res.send(`Found ${results.length} user`);
//                 req.session.username = results[0].name;
//                 req.session.favorite_color = results[0].favorite_color;
//                 req.session.authenticated = true;
//                 res.redirect('/logged-in');
//             }

//             else{
//                 res.send('No users found')
//             }
//             console.log(results);
//         }
//     );

//     // res.send('Got a POST request'); 

// });


// // SIGN UP
// app.get('/signup', (req, res) => {
//     res.render('signup')
// })

// // Route for creating a new user
// app.post('/users', (req, res) => {
//     const { name, email, password, favorite_color } = req.body;
//     const user = { name, email, password, favorite_color };

//     // Insert new user into MySQL database
//     connection.query('INSERT INTO users SET ?', user, (err, results) => {
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
// });

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});