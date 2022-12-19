const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BlockedDatesSchema = new Schema({
  notaryId: String, // user id ?? (prev -> notary id)
  accessToken: String,
  refreshToken: String,
  linkedCalenderEmail: String, // auth email client
  linkedCalenderId: String,
  blockSlots: [
    {
      timeStart: Number,
      timeEnd: Number,
      date: Date,
    }
  ]
});

const BlockDateModel = mongoose.model("block-dates", BlockedDatesSchema)

module.exports = { BlockDateModel };