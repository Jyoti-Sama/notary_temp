const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const { authRouter } = require('./routes/auth');
const { blockDateRouter } = require('./routes/blockDates');
const { calenderRouter } = require('./routes/calender');
require('./auth');

const app = express();

app.use(express.urlencoded());
app.use(express.json());

const MONGODB_URI = "mongodb+srv://test:test@cluster0.kcm3d.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(MONGODB_URI).then(() => console.log("db connected...")).catch(err => console.log(err))

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRouter);
app.use("/block-date", blockDateRouter);
app.use("/calendar", calenderRouter);

app.listen(5000, () => console.log('listening on port: 5000'));