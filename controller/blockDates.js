const { BlockDateModel } = require("../models/BlockDate.model")


async function commonAddBlockDate(notaryId, linkedCalenderEmail, linkedCalenderId, timeStart, timeEnd, date) {

    try {
        const oldBlockDate = await BlockDateModel.findOne({
            notaryId: notaryId
        });
        if (oldBlockDate) {
            const blockSlots = oldBlockDate.blockSlots;
            blockSlots.push({
                timeStart: timeStart,
                timeEnd: timeEnd,
                date: date
            })

            oldBlockDate.blockSlots = blockSlots;
            const response = await oldBlockDate.save();
            return response;
        } else {
            const newBlockDate = new BlockDateModel({
                notaryId: notaryId,
                linkedCalenderEmail: linkedCalenderEmail,
                linkedCalenderId: linkedCalenderId,
                blockSlots: [
                    {
                        timeStart: timeStart,
                        timeEnd: timeEnd,
                        date: date,
                    }
                ]
            })

            const response = await newBlockDate.save();
            return response;
        }
    } catch (error) {
        throw error
    }
};

const getAllBlockDates = async (req, res) => {
    try {
        const notaryId = req.body.notaryId;

        const blockDate = await BlockDateModel.findOne({
            notaryId: notaryId
        });

        if (!blockDate) {
            return res.status(400).json({ message: "no data available"})
        }

        const blockState = blockDate.blockSlots;

        res.status(200).json({ blockState })
    } catch (error) {
        res.status(400).json({ message: "something went wrong..", error: error.message })
    }
}

const addBlockDate = async (req, res) => {
    try {
        const { notaryId, linkedCalenderEmail, linkedCalenderId, timeStart, timeEnd, date } = req.body;
        const response = await commonAddBlockDate(notaryId, linkedCalenderEmail, linkedCalenderId, timeStart, timeEnd, date);
        res.status(200).json({ message: "block date added" })
    } catch (error) {
        res.status(400).json({ message: "something went wrong..", error: error.message })
    }
}

module.exports = {
    getAllBlockDates,
    addBlockDate,
    commonAddBlockDate
}