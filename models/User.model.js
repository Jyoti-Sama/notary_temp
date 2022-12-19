const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    name: String,
    email: String,
    accessToken: String,
    refreshToken: String,
});

const UserModel = mongoose.model("temp-user", UserSchema)

module.exports = { UserModel };