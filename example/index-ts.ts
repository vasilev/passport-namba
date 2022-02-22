// To run this example (set your own values to CONSUMER_KEY and CONSUMER_SECRET):
//     yarn add express passport connect-ensure-login express-session https://github.com/vasilev/passport-namba.git
//     yarn add @types/node @types/express @types/express-session @types/passport @types/connect-ensure-login
//     tsc --esModuleInterop true index-ts.ts
//     CONSUMER_KEY=... CONSUMER_SECRET=... node index-ts.js

import express, {Response, Request} from 'express';
import express_session from 'express-session';
import passport from 'passport';
import {Strategy as NambaStrategy} from 'passport-namba';
import ensure from 'connect-ensure-login';

export interface NambaUser {
    profileUrl: string
    username: string
}

export interface NambaRequest extends Request {
    user: NambaUser
}

const app = express();
app.use(express_session({
    secret: process.env.SECRET || 'secret',
    resave: false, saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function (req: Request, res: Response) {
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
    function (token, tokenSecret, profile, cb: CallableFunction) {
        return cb(null, profile);
    }
));

passport.serializeUser(function (user: NambaUser, done) {
    done(null, user);
});

passport.deserializeUser(function (user: NambaUser, done) {
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
    function (req: NambaRequest, res: Response) {
        res.send(`<html><h1>Restricted area</h1>
	  <p>Authenticated as: <a href="${req.user.profileUrl}">${req.user.username}</a></p>
	  </html>`);
    });

app.get('/logout', function (req: Request, res: Response) {
    req.logout();
    res.redirect('/');
});

app.listen(3000);
