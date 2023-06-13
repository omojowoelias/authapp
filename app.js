const express = require('express');
const app = express();
const session = require('express-session');
const mongoose = require('mongoose');
//const cookieParser = require("cookie-parser");
//const MongoStore = require('connect-mongo')(session);
const MongoDBsession = require('connect-mongodb-session')(session)
const ejs = require('ejs');
const bcrypt = require('bcrypt');

//Gives access to variables set in the .env files via `process.env.VARIABLE_NAME`
require('dotenv').config();

//built in express parse for http responses
app.use("view engine", ejs);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
//app.use(cookieParser());


var logRoutes = require('./routes/loginRoutes.js');
var regRoutes = require('./routes/registerRoutes.js');

const mongoURI = ("mongodb://127.0.0.1:27017/trainingdb");
const UserModel = require('./models/User.js');

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(res => {
    console.log('Mongodb connected');
}).catch ((err) => console.log('Error connecting to DB : ' + err));

app.use('/login', logRoutes);
app.use('/register', regRoutes);


const store = new MongoDBsession({
    uri: mongoURI,
    collection: "session",
})

app.use(session({  //store information abt a user
    secret: 'some secret',
    resave: false,
    saveUninitialized: true,
    store: store,
    // cookie: {
    //     maxAge: 1000 * 60 * 60 * 24 // Equals 1 day (1 day * 24hr/1day * 60 min/1hr)
    // }
}));


//I made a req to my server and my server has made a session for my browser and a cookie is sent back wch is saved in db
app.get('/Page', (req, res) => {
    console.log(req.session);
    res.send('Elias app is up and running!!')
});

const isAuth = (req, res, next) => {
    if(req.session.isAuth) {
        next()
    } else {
        res.redirect('/login')
    }
}

app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/login', (req, res) => {
    res.render('login')
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await Username.findOne({email});

    if(!user) {
        return res.redirect('/login');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        return res.redirect('/login');
    }
    res.redirect('/dashboard');
});

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    let user = await UserModel.findOne({email});
    if(user) {
        return res.redirect('/register');
    }

    const hashedPass = await bcrypt.hash(password, 12);

    user = new UserModel({
        username,
        email,
        password: hashedPass
    })
    await user.save();
    res.redirect("/login");
})


app.get('/dashboard', isAuth, (req, res) => {
    res.render('dashboard');
})

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) throw err;
        res.redirect('/');
    });
})
app.listen(5000, () => {
    console.log('The server is up and running at port 5000!!!')
});