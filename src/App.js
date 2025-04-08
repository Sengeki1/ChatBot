import './App.css';
import Chat from './Components/Chat'
import { useState, useEffect } from "react"

let questions = [];
let answers = [];

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

        <form onSubmit={(event) => {
            event.preventDefault();
            questions.push(`Question: ${inputValue}\n`);
            answers.push("Answer: ");
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
