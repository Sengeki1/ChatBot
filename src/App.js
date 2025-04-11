import './App.css';
import Chat from './Components/Chat';
import { useState, useEffect } from "react";

const { containerBootstrap } = require('@nlpjs/core');
const { Nlp } = require('@nlpjs/nlp');
const { LangEn } = require('@nlpjs/lang-en-min');
const { LangEs } = require('@nlpjs/lang-es');

console.log = function() {}

var enCorpus = require('./corpus-en.json');
var esCorpus = require('./corpus-es.json');

let questions = [];
let answers = [];

let nlp_;
async function nlp () {
  const container = await containerBootstrap();
  
  container.use(Nlp);
  container.use(LangEn);
  container.use(LangEs);

  nlp_ = container.get('nlp');
  nlp_.settings.log = false;
  nlp_.settings.autoSave = false;

  await nlp_.addCorpus(enCorpus);
  await nlp_.addCorpus(esCorpus);
  await nlp_.train();
};

async function trainNlp (language, intent, utterances, answers) {
  if (language === "es") {
    enCorpus.data.push(
      {
        "intent": intent,
        "utterances": utterances,
        "answers": answers,
      }
    )
  } else {
    esCorpus.data.push(
      {
        "intent": intent,
        "utterances": utterances,
        "answers": answers,
      }
    )
  }

  nlp()
}

trainNlp(
  "en", 
  "agent.work", 
  ["How can i change the page"], 
  ["By clicking on the top", "Dont know"]
)

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
            if (inputValue.length > 0) {
              questions.push(`Question: ${inputValue}\n`);

              const language = await nlp_.guessLanguage(inputValue);
              const answer = await nlp_.process(language, inputValue);

              answers.push(`Answer: ${answer.answer}`);
              setSubmitForm(true);
            }
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
