const express = require('express'),
      expressSession = require('express-session'),
      path = require('path'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      passport = require('passport'),
      LocalStrategy = require('passport-local'),
      passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect('mongodb://localhost/MKT_Demo');

const User = require('./src/model/user.js');

const app = express();
app.use(expressSession({
  secret: 'This is a secret!',
  resave: false,
  saveUninitialized: false
}));
app.use(bodyParser.urlencoded({extended: true}));

const viewPath = path.resolve(__dirname, 'src/views');
app.set('view engine', 'ejs');
app.set('views', viewPath);
app.use(express.static(path.resolve(__dirname, 'src/public')));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware
app.use((req, res, next) => {
  res.locals.currentPage = '';
  res.locals.currentUser = undefined;
  next();
});

// Check if the user is login
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

// Routes
app.get('/', (req, res) => {
  res.render('home', {
    currentPage: 'home'
  });
});

app.get('/secret', isLoggedIn, (req, res) => {
  res.render('secret', {
    currentPage: 'secret'
  });
});

app.get('/register', (req, res) => {
  res.render('register', {
    currentPage: 'register'
  });
});

// Register Route
app.post('/register', (req, res) => {

  let username = req.body.username;
  let password = req.body.password;

  User.register(new User({
    username: username
  }), password, (err, user) => {
    if (err) {
      console.log(err);
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/');
    });
  });

});

// Login Route
app.get('/login', (req, res) => {
  res.render('login', {
    currentPage: 'login'
  });
});

// Login logic
app.post('/login', passport.authenticate('local', {
  successRedirect: '/secret',
  failureRedirect: '/login'
}), (req, res) => {

});

// Logout logic
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// function isLoggedIn(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect('/login');
// };

app.listen(3002, (req, res) => {
  console.log('App on port 3002!');
});
