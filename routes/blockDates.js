const express = require("express");
const { getAllBlockDates, addBlockDate } = require("../controller/blockDates");
const blockDateRouter = express.Router();

blockDateRouter.post('/all', getAllBlockDates);
blockDateRouter.post("/add", addBlockDate);

module.exports = { blockDateRouter };