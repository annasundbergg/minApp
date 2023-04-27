var mysql = require("mysql");
require('dotenv').config();

//i package.json under scripts skriver vi bara olika kommandon som förenklar för oss. T ex "start": "nodemon index.js" gör att vi använder vår dependency nodemon som uppdaterar vår kod hela tiden utan att vi behöver cancel och run igen. Man kan även använda det om man t ex vill kompilera flera ccs filer osv.

//databas connection. Nu har vi kört npm install mysql för att göra detta

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASENAME
});

connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }

    console.log("connected as id " + connection.threadId);
});

module.exports = connection;