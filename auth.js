const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const refresh = require('passport-oauth2-refresh');

const GOOGLE_CLIENT_ID = '237405059009-p6imhk3mla2ku45290khetllkio5kvls.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

const googleStrategy = new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/google/callback",
  passReqToCallback: true,
},
  function (request, accessToken, refreshToken, profile, done) {
    console.log(accessToken, refreshToken)
    return done(null, profile);
  }
)

passport.use(googleStrategy);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

refresh.use(googleStrategy);

const refresAccessTokenHandler = (userRefreshToken) => {
  try {
    refresh.requestNewAccessToken(
      'google',
      userRefreshToken,
      function (err, accessToken, refreshToken) {
        if (err) {
          console.log(err);
          throw err
        }
        return accessToken;
      },
    );
  } catch (error) {
    throw error;
  }
}


module.exports = { refresAccessTokenHandler };