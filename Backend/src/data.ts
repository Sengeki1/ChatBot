import fs from 'fs'

type TrainingEntry = {
  intent: string;
  utterances: string[];
  answers: string[];
};

export const saveData = (newEntry: TrainingEntry) => {
    fs.readFile('src/train.json', 'utf-8', (error, data) => {
        let jsonData: TrainingEntry[] = []
        console.log(data)
        if (!error && data) {
            try {
                jsonData = JSON.parse(data)
            } catch (err) {
                console.log(err)
            }
        } else {
            console.log(error)
        }

        const index = jsonData['data'].findIndex(entry => entry.intent === newEntry.intent);
        if (index !== -1) {
                newEntry.utterances.forEach(u => {
                    if (!jsonData['data'][index].utterances.includes(u)) {
                        jsonData['data'][index].utterances.push(u);
                    }
                });
        } else {
            jsonData['data'].push(newEntry);
        }  

        fs.writeFile('src/train.json', JSON.stringify(jsonData, null, 2), (errorWrite) => {
            if (errorWrite) {
                console.log(errorWrite);
            }
        })
    })
}

saveData({
    "intent": "train",
    "utterances": ["Have you eaten today?"],
    "answers": [""]
});