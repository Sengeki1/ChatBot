import './App.css';
import Chat from './Components/Chat';
import { useState, useEffect } from "react";

const { containerBootstrap } = require('@nlpjs/core');
const { Nlp } = require('@nlpjs/nlp');
const { LangEn } = require('@nlpjs/lang-en-min');

let questions = [];
let answers = [];

async function nlp (question) {
  const container = await containerBootstrap();
  
  container.use(Nlp);
  container.use(LangEn);
  const nlp = container.get('nlp');
  nlp.settings.autoSave = false;

  nlp.addLanguage('en');
  // Adds the utterances and intents for the NLP
  nlp.addDocument('en', 'goodbye for now', 'greetings.bye');
  nlp.addDocument('en', 'bye bye take care', 'greetings.bye');
  nlp.addDocument('en', 'okay see you later', 'greetings.bye');
  nlp.addDocument('en', 'bye for now', 'greetings.bye');
  nlp.addDocument('en', 'i must go', 'greetings.bye');
  nlp.addDocument('en', 'hello', 'greetings.hello');
  nlp.addDocument('en', 'hi', 'greetings.hello');
  nlp.addDocument('en', 'howdy', 'greetings.hello');
  
  // Train also the NLG
  nlp.addAnswer('en', 'greetings.bye', 'Till next time');
  nlp.addAnswer('en', 'greetings.bye', 'see you soon!');
  nlp.addAnswer('en', 'greetings.hello', 'Hey there!');
  nlp.addAnswer('en', 'greetings.hello', 'Greetings!');
  await nlp.train();
  
  const response = await nlp.process('en', question);
  return response;
};

function App() {
  const [inputValue, setInputValue] = useState('');
  const [submitForm, setSubmitForm] = useState(false);


  useEffect(() => {
    if (submitForm) {
      setInputValue("");
      setSubmitForm(false);
    }
  }, [inputValue, submitForm]);

  return (
    <div className="App">
        <Chat questions={questions} answers={answers}/>

      <header className="App-header">

        <form onSubmit={async (event) => {
            event.preventDefault();
            questions.push(`Question: ${inputValue}\n`);
            const answer = await nlp(inputValue);
            answers.push(`Answer: ${answer.answer}`);
            setSubmitForm(true);
          }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter something"
          />
          <br/>
          <button type="submit">Submit</button>
        </form>

      </header>
      
    </div>
  );
}

export default App;
