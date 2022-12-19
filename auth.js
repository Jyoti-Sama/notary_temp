const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const refresh = require('passport-oauth2-refresh');
const { UserModel } = require('./models/User.model');
const jwt = require("jsonwebtoken");
const JWT_SECRET = "secret";

const GOOGLE_CLIENT_ID = '237405059009-p6imhk3mla2ku45290khetllkio5kvls.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

const googleStrategy = new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/google/callback",
  passReqToCallback: true,
},
  async function (request, accessToken, refreshToken, profile, done) {

    const name = profile.displayName;
    const email = profile.email;

    try {
      const oldUser = await UserModel.findOneAndUpdate(
        { email: email },
        { accessToken: accessToken, refreshToken: refreshToken }
      );

      if (!oldUser) {
        const newUser = new UserModel({
          name,
          email,
          accessToken,
          refreshToken
        });

        await newUser.save()

        const userToken = jwt.sign({
          userId: newUser._id,
          email: email,
          accessToken: accessToken
        }, JWT_SECRET);

        profile.userToken = userToken;

        return done(null, profile);
      }

      const userToken = jwt.sign({
        userId: oldUser._id,
        email: email,
        accessToken: accessToken
      }, JWT_SECRET);

      profile.userToken = userToken;
      return done(null, profile);
    } catch (error) {

    }
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

const refresAccessTokenHandler = async (userRefreshToken) => {
  try {
    refresh.requestNewAccessToken(
      'google',
      userRefreshToken,
      function (err, accessToken, refreshToken) {
        if (err, "in refresh Access Token Handler") {
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