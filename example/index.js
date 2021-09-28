// To run this example (set your own values to CONSUMER_KEY and CONSUMER_SECRET):
//     yarn add express passport connect-ensure-login express-session https://github.com/vasilev/passport-namba.git
//     CONSUMER_KEY=... CONSUMER_SECRET=... node index.js

const express = require('express');
const passport = require('passport');
var NambaStrategy = require('passport-namba').Strategy;
const ensure = require('connect-ensure-login');

var app = express();
app.use(require('express-session')({
    secret: process.env.SECRET || 'secret',
    resave: false, saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function (req, res) {
    res.send(`<html><h1>Namba.kz OAuth example</h1><ol>
    <li><a href="/oauth/namba">Login</a></li>
    <li><a href="/restricted">Restricted area</a></li>
    <li><a href="/logout">Logout</a></li>
    </ol></html>`);
});

passport.use('nambakz', new NambaStrategy({
        consumerKey: process.env.CONSUMER_KEY,
        consumerSecret: process.env.CONSUMER_SECRET,
        callbackURL: 'http://0.0.0.0:3000/oauth/namba/callback',
    },
    function (token, tokenSecret, profile, cb) {
        return cb(null, profile);
    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

app.get('/oauth/namba', passport.authenticate('nambakz'));

app.get('/oauth/namba/callback',
    passport.authenticate('nambakz', {failureRedirect: '/oauth/namba'}),
    function (req, res) {
        // Successful authentication.
        res.redirect('/');
    }
);

app.get('/restricted',
    ensure.ensureLoggedIn('/oauth/namba'),
    function (req, res) {
        res.send(`<html><h1>Restricted area</h1>
	  <p>Authenticated as: <a href="${req.user.profileUrl}">${req.user.username}</a></p>
	  </html>`);
    });

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

app.listen(3000);
