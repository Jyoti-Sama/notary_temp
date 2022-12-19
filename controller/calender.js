const { google } = require('googleapis');
const { refresAccessTokenHandler } = require('../auth');
const { UserModel } = require('../models/User.model');
const { commonAddBlockDate } = require('./blockDates');

const GOOGLE_CLIENT_ID = '237405059009-p6imhk3mla2ku45290khetllkio5kvls.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    'http://localhost:5000'
);

async function setCalendArEvent(access_token, summary, description, colorId, start, end) {
    try {
        oauth2Client.setCredentials({
            access_token
        });

        const calender = google.calendar('v3');
        const response = await calender.events.insert({
            auth: oauth2Client,
            calendarId: 'primary',
            requestBody: {
                summary: summary,
                description: description,
                colorId: colorId,
                start: {
                    dateTime: new Date(start)
                },
                end: {
                    dateTime: new Date(end)
                }
            }
        });

        return response;
    } catch (error) {
        throw error
    }
}


const addCalenderEvent = async (req, res) => {

    try {

        const userId = req.body?.userId;
        let access_token = req.body?.access_token;
        const description = req.body?.description;
        const summary = req.body?.summary;
        const colorId = req.body?.colorId;
        const start = req.body?.start;
        const end = req.body?.end;
        const email = req.body?.email;

        if (userId === undefined) return res.status(400).json({ message: "userId required" });
        // if (access_token === undefined) return res.status(400).json({ message: "access_token required" });
        if (description === undefined) return res.status(400).json({ message: "description required" });
        if (colorId === undefined) return res.status(400).json({ message: "color id required" });
        if (summary === undefined) return res.status(400).json({ message: "summary required" });
        if (start === undefined) return res.status(400).json({ message: "start required" }); // in ms
        if (end === undefined) return res.status(400).json({ message: "end required" }); // in ms

        let userData;

        if (access_token === undefined) {
            userData = await UserModel.findById(userId);
            access_token = userData.accessToken;
        }

        try {
            const response = await setCalendArEvent(access_token, summary, description, colorId, start, end);
            console.log(response);

            console.log(userData)

            //* adding the block date
            await commonAddBlockDate(userId, email, colorId, start, end, new Date(start))

            return res.status(200).json({ message: "event created" });
        } catch (error) {
            console.log(error, "inner.. calendar")

            try {
                const refreshToken = userData.refreshToken;
                const newAccessToken = await refresAccessTokenHandler(refreshToken);
                const response2 = await setCalendArEvent(newAccessToken, summary, description, colorId, start, end);
                console.log(response2);

                //* adding the block date
                await commonAddBlockDate(userId, email, colorId, start, end, new Date(start))

                return res.status(200).json({ message: "event created" });
            } catch (err) {
                console.log(err, "outer last.. calendar")
                res.status(400).json({ message: "something went wrong please login again", error: err.message })
            }
        }


    } catch (error) {
        res.status(400).json({ message: "something went wrong", error: error.message })
    }
}

module.exports = {
    addCalenderEvent
}