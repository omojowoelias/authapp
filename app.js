const express = require('express');
const app = express();
const session = require('express-session');
const mongoose = require('mongoose');

var logRoutes = require('./routes/loginRoutes.js');
var regRoutes = require('./routes/registerRoutes.js');


app.use('/login', logRoutes);
app.use('/register', regRoutes);

app.use(session({  //store information abt a user
    secret: 'some secret',
    resave: false,
    saveUninitialized: true,
    //store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // Equals 1 day (1 day * 24hr/1day * 60 min/1hr)
    }
}));

app.get('/Page', (req, res) => {
    res.send('Elias app is up and running!!')
});


app.listen(5000, () => {
    console.log('The server is up and running at port 5000!!!')
})