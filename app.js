const express = require('express');
const app = express();
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);


//Gives access to variables set in the .env files via `process.env.VARIABLE_NAME`
require('dotenv').config();

//built in express parse for http responses
app.use(express.json());
app.use(express.urlencoded({extended: true}));

var logRoutes = require('./routes/loginRoutes.js');
var regRoutes = require('./routes/registerRoutes.js');



app.use('/login', logRoutes);
app.use('/register', regRoutes);


// var store = new MongoDBStore (
//     {
//         uri: ' mongodb+srv://2018leke:<password>@cluster0.yhn4ltr.mongodb.net/',
//         databaseName: 'Authapp',
//         collection: 'Authapp',
//     }
// )

const dbString = 'mongodb://localhost:27017/trainingdb';
const dbOptions = {
    userNewUrlParser: true,
    useUnifiedTopology: true
}

const connection = mongoose.createConnection(dbString, dbOptions);

const sessionStore = new MongoStore(
    {
        mongooseConnection : connection,
        collection: 'session'
    }
)
app.use(session({  //store information abt a user
    secret: 'some secret',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
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