# passport-namba

[Passport](http://passportjs.org/) strategy for authenticating with Namba using the OAuth 1.0a API.

This module lets you authenticate using Namba in your Node.js applications. By plugging into Passport, Namba
authentication can be easily and unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including [Express](http://expressjs.com/).

## Usage

#### Create an Application

Before using `passport-namba`, you need to register your application with Namba. If you have not already done so, a new
application can be added at [Namba OAuth apps list](http://dev.namba.kz/applications/list.php). Your application will be
issued an OAuth Consumer Key and OAuth Consumer Secret, which need to be provided to the strategy.

#### Configure Strategy

The Namba authentication strategy authenticates users using a Namba account and OAuth tokens. The consumer key and
consumer secret obtained when registering an application are supplied as options when creating the strategy. The
strategy also requires a `verify` callback, which receives the access token and corresponding secret as arguments, as
well as `profile` which contains the authenticated user's Namba profile. The `verify` callback must call `cb`
providing a user to complete authentication.

    passport.use(new NambaStrategy({
        consumerKey: NAMBA_CONSUMER_KEY,
        consumerSecret: NAMBA_CONSUMER_SECRET,
        callbackURL: 'http://127.0.0.1:3000/auth/namba/callback'
      },
      function(token, tokenSecret, profile, cb) {
        User.findOrCreate({ nambaId: profile.id }, function (err, user) {
          return cb(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'namba'` strategy, to authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/) application:

    app.get('/auth/namba',
      passport.authenticate('namba'));
    
    app.get('/auth/namba/callback', 
      passport.authenticate('namba', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Example

[Express](http://expressjs.com/)-based
[example](https://github.com/vasilev/passport-namba/blob/main/example/index.js) is available.
Also there is a simple [TypeScript example](https://github.com/vasilev/passport-namba/blob/main/example/index-ts.ts).

## Credits

This project is based on code and texts from:

* [jaredhanson/passport-oauth1-userinfo](https://github.com/jaredhanson/passport-oauth1-userinfo)
* [jaredhanson/passport-google-oauth1](https://github.com/jaredhanson/passport-google-oauth1)
