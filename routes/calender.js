const express = require("express");
const { addCalenderEvent } = require("../controller/calender");
const calenderRouter = express.Router();

calenderRouter.post("/add-event", addCalenderEvent)

module.exports = { calenderRouter };