/**
 * Parse profile.
 *
 * Parses user profile as fetched from Namba API.
 *
 * @param {object|string} json
 * @return {object}
 * @access public
 */
exports.parse = function (json) {
    if ('string' == typeof json) {
        json = JSON.parse(json);
    }

    var profile = {};
    profile.id = json.login;
    profile.username = json.login;
    profile.displayName = json.firstname + ' ' + json.lastname;
    profile.name = {
        familyName: json.lastname,
        givenName: json.firstname
    };
    profile.profileUrl = 'http://namba.kz/#!/content/user/' + json.login;

    if (json.avatar) {
        profile.photos = [{value: json.avatar}];
    }

    return profile;
};
