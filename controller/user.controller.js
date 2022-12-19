const { UserModel } = require("../models/User.model");

UserModel.find().then(data => console.log(data))