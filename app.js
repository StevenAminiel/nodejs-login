const express = require ("express");
const path = require ("path");
const mysql = require ("mysql");
const dotenv = require ("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config({ path: './.env'});


const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});


const publicDirectory = path.join(__dirname, './public')
app.use(express.static(publicDirectory));

// parsing html codes to url
app.use(express.urlencoded ({extended: false}));

//parse json bodies(ZILIZO TUMWA KUTOKA KWENYE  API)
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'hbs');

db.connect(  (error)  => {

    if(error){
        console.log(error)
    }
    else{
        console.log("Mysql connected...")
    }


})

// route definition

app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.listen(5000, () => {
    console.log("server started on port 5000");
})