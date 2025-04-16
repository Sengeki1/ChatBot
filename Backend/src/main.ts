import express from 'express'
import cors from 'cors';
import fetch from 'node-fetch';
import { detect } from 'langdetect';
import env from 'dotenv'

env.config();

const app = express();
const PORT = 3003;

app.use(cors()); // allow all origins
app.use(express.json()); // parse JSON bodies

app.post('/translate', async (req, res) => {
    const textData = req.body.text;
    const locale = req.body.locale;

    console.log(req.body);
    try {
        const response = await fetch(`${process.env.TRANSLATIONURL}en/${locale}/${encodeURIComponent(textData)}`);
        const data = await response.json() as {translation: string};
        console.log(data);
        res.status(200).json({ text: data.translation });
    } catch (err) {
        if (err.name === 'TooManyRequestsError') {
            console.log("retry with another proxy agent");
        }
    }
});

app.post('/translateEN', async (req, res) => {
    const textData = req.body.text;
    const locale = req.body.locale;

    try {
        const response = await fetch(`${process.env.TRANSLATIONURL}${locale}/en/${encodeURIComponent(textData)}`);
        const data = await response.json() as {translation: string};
        console.log(data);
        res.status(200).json({ text: data.translation });
    } catch (err) {
        if (err.name === 'TooManyRequestsError') {
            console.log("retry with another proxy agent");
        }
    }
});

app.post('/guessLanguage', async (req, res) => {
    const textData = req.body.text;

    try {
        const data = detect(textData);
        console.log(data);
        data?.forEach((value) => {
            if (value?.lang === 'en' || value?.lang === 'es' || value?.lang === 'pt') {
                res.status(200).json({ text: value?.lang })
            } else {
                res.status(200).json({ text: 'en'})
            }
        })
    } catch (err) {
        console.log(err);
    }
});


app.listen(PORT, "localhost", () => {
    console.log("Listening on port 3003");
});