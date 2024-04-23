const express = require('express');
const { engine } = require('express-handlebars');
const myconnection = require('express-myconnection');
const mysql = require('mysql2'); 
const session = require('express-session');
const bodyParser = require('body-parser');
const loginRoutes = require('../src/routes/login.routes');

const app = express();
app.set('port', 4000);

app.set('views', __dirname + '/views');
app.engine('hbs', engine({
    extname: '.hbs',
}));    
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express.static('images'));

app.use(myconnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: '0000',
    port: 3306,
    database: 'bookdb'
}));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.listen(app.get('port'), () => {
    console.log('Listening on port ', app.get('port'));
});

app.use('/', loginRoutes);

// app.get('/home', (req, res) => {
//     res.render('home');
// })