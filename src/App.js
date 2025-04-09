import './App.css';
import Chat from './Components/Chat';
import { useState, useEffect } from "react";

const { containerBootstrap } = require('@nlpjs/core');
const { Nlp } = require('@nlpjs/nlp');
const { LangEn } = require('@nlpjs/lang-en-min');
var obj = require('./corpus-en.json');

let questions = [];
let answers = [];

async function nlp (question) {
  const container = await containerBootstrap();
  
  container.use(Nlp);
  container.use(LangEn);
  const nlp = container.get('nlp');
  nlp.settings.autoSave = false;

  await nlp.addCorpus(obj);
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
