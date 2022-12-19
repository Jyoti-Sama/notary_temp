const express = require("express");
const authRouter = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "secret";

require('../controller/user.controller')

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

authRouter.get('/', (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
});

authRouter.get('/auth/google',
    passport.authenticate('google',
        {
            scope: ['email', 'profile', 'https://www.googleapis.com/auth/calendar'],
            accessType: 'offline',
            prompt: 'consent'
        }

    ));

authRouter.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/protected',
        failureRedirect: '/auth/google/failure'
    })
);

authRouter.get('/protected', isLoggedIn, (req, res) => {
    console.log(req.user)
    res.send(`Hello ${req.user.displayName} this token 
    need to send back to client and store it to 
    local storage and the token will be send 
    via redirect url... : ${req.user.userToken}`);
});

authRouter.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('Goodbye!');
});

authRouter.get('/auth/google/failure', (req, res) => {
    res.send('Failed to authenticate..');
});

authRouter.post('/decode', async (req,res) => {
    try {
        const userToken = req.body.userToken;
        console.log(userToken)
        const decodeData = await jwt.verify(userToken, JWT_SECRET);
        res.status(200).json({decodeData});
    } catch (error) {
        res.status(200).json({error: error.message});
    }
})

module.exports = { authRouter };