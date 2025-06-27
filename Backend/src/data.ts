import * as fs from 'fs/promises';

type TrainingEntry = {
    intent: string;
    utterances: string[];
    answers: string[];
};

type JsonData = {
    data: TrainingEntry[];
};

const FILE_PATH = 'src/database/train.json';

export async function saveData(newEntry: TrainingEntry) {
    try {
        const fileContent = await fs.readFile(FILE_PATH, 'utf-8');
        console.log(fileContent)
        const jsonData: JsonData = JSON.parse(fileContent);

        const index = jsonData.data.findIndex(entry => entry.intent === newEntry.intent);

        if (index !== -1) {
            newEntry.utterances.forEach(u => {
            if (!jsonData.data[index].utterances.includes(u)) {
                jsonData.data[index].utterances.push(u);
            }
        });
        } else {
            jsonData.data.push(newEntry);
        }

        await fs.writeFile(FILE_PATH, JSON.stringify(jsonData, null, 2));
    } catch (err: any) {
        if (err.code === 'ENOENT') {
            const initialData: JsonData = { data: [newEntry] };
            await fs.writeFile(FILE_PATH, JSON.stringify(initialData, null, 2));
        } else {
            console.error('Error in saveData:', err);
            throw err; 
        }
    }
}
