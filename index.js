//detta är ett exempel från express documentation, om man skriver "node index.js" i terminalen så kan man gå till localhost:3000 i browsern, så kommer denna sida upp:

const express = require("express");
const app = express();
const port = 3000;
var mysql = require("mysql");
//installerar (npm i) express-session för att kunna hantera vår session
const session = require('express-session'); 
//body-parser här nedan är inbyggt i express och gör om body till json

const moment = require('moment');
//sparar funktioner som är tillgängliga i "views" sen: 
app.locals.moment = moment; 

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

//Controllers
const posts = require('./controllers/posts');
app.use(posts);

//API Endpoints
const api = require('./api/endpoints');
app.use(api);


//nedan rad för att vi ska kunna länka till css i html utan att länka via olika mappar.
app.use(express.static("public"));

//Set EJS as the view engine
app.set('view engine', 'ejs');

//specify the location of the of the view folder
app.set('views', './views')

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});