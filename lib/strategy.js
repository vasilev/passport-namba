// Based on https://github.com/jaredhanson/passport-google-oauth1/blob/master/lib/strategy.js
// Load modules.
var OAuthStrategy = require('passport-oauth1')
    , util = require('util')
    , Profile = require('./profile')
    , InternalOAuthError = require('passport-oauth1').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The  authentication strategy authenticates requests by delegating to
 * Namba using the OAuth protocol.
 *
 * Applications must supply a `verify` callback which accepts a `token`,
 * `tokenSecret` and service-specific `profile`, and then calls the `cb`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occurred, `err` should be set.
 *
 * Options:
 *   - `consumerKey`     identifies client to Namba
 *   - `consumerSecret`  secret used to establish ownership of the consumer key
 *   - `callbackURL`     URL to which Namba will redirect the user after obtaining authorization
 *
 * Examples:
 *
 *     passport.use(new NambaStrategy({
 *         consumerKey: '123-456-789',
 *         consumerSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/namba/callback'
 *       },
 *       function(token, tokenSecret, profile, cb) {
 *         User.findOrCreate(..., function (err, user) {
 *           cb(err, user);
 *         });
 *       }
 *     ));
 *
 * @constructor
 * @param {Object} options
 * @param {Function} verify
 * @access public
 */
function Strategy(options, verify) {
    options = options || {};
    options.requestTokenURL = options.requestTokenURL || 'http://api.namba.kz/oauth/request_token.php';
    options.accessTokenURL = options.accessTokenURL || 'http://api.namba.kz/oauth/access_token.php';
    options.userAuthorizationURL = options.userAuthorizationURL || 'https://login.namba.kz/login2.php';
    options.userProfileURL = options.userProfileURL || 'http://api.namba.kz/getUserInfo2.php';
    options.sessionKey = options.sessionKey || 'oauth:namba';

    OAuthStrategy.call(this, options, verify);
    this._userProfileURL = options.userProfileURL;
    this.name = 'namba';
}

// Inherit from `OAuthStrategy`.
util.inherits(Strategy, OAuthStrategy);

/**
 * Retrieve user profile from Namba.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `id`
 *   - `displayName`
 *
 * @param {String} token
 * @param {String} tokenSecret
 * @param {Object} params
 * @param {Function} done
 * @access protected
 */
Strategy.prototype.userProfile = function (token, tokenSecret, params, done) {
    this._oauth.get(this._userProfileURL, token, tokenSecret, function (err, body, res) {
        if (err) {
            return done(new InternalOAuthError('Failed to fetch user profile', err));
        }

        var json;
        try {
            json = JSON.parse(body);
        } catch (ex) {
            return done(new Error('Failed to parse user profile'));
        }

        var profile = Profile.parse(json);
        profile.provider = 'namba';
        profile._raw = body;
        profile._json = json;

        done(null, profile);
    });
};

// Expose constructor.
module.exports = Strategy;
