import express from 'express'
import cors from 'cors';
import fetch from 'node-fetch';
import { detect } from 'langdetect';
import * as env from 'dotenv';
import { saveData } from './data'

env.config();

const app = express();
const PORT = 3003;

app.use(cors()); // allow all origins
app.use(express.json()); // parse JSON bodies

app.post('/translate', async (req, res) => {
    console.log('Request received');
    const textData = req.body.text;
    const locale = req.body.locale;

    try {
        const response = await fetch(`${process.env.TRANSLATIONURL}en/${locale}/${encodeURIComponent(textData)}`);
        const data = await response.json() as {translation: string};
        
        res.status(200).json({ text: data.translation });
    } catch (err: unknown) {
        if (typeof err === 'object' && err !== null && 'name' in err) {
            if ((err as any).name === 'TooManyRequestsError') {
                console.log("retry with another proxy agent");
            }
        } else {
            console.log(err);
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/translateEN', async (req, res) => {
    console.log('Request received');
    const textData = req.body.text;
    const locale = req.body.locale;

    try {
        const response = await fetch(`${process.env.TRANSLATIONURL}${locale}/en/${encodeURIComponent(textData)}`);
        const data = await response.json() as {translation: string};

        res.status(200).json({ text: data.translation });
    } catch (err: unknown) {
        if (typeof err === 'object' && err !== null && 'name' in err) {
            if ((err as any).name === 'TooManyRequestsError') {
                console.log("retry with another proxy agent");
            }
        } else {
            console.log(err);
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/guessLanguage', async (req, res) => {
    const textData = req.body.text;

    try {
        const data = detect(textData);
        const supportedLang = data?.find(value =>
            value.lang === 'en' || value.lang === 'es' || value.lang === 'pt'
        );

        if (supportedLang) {
            return res.status(200).json({ text: supportedLang.lang });
        } else {
            return res.status(200).json({ text: 'en' }); // fallback
        }   
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/train', async (req, res) => {
    const textData = req.body.text;

    try {
        await saveData({
            "intent": "train",
            "utterances": [textData],
            "answers": [""]
        });

        return res.status(200).end()
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


app.listen(PORT, "localhost", () => {
    console.log("Listening on port 3003");
});