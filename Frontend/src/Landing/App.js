import { useState, useEffect } from "react";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "./App.css"
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator
} from "@adelespinasse/chat-ui-kit-react";

const { containerBootstrap } = require('@nlpjs/core');
const { Nlp } = require('@nlpjs/nlp');
const { LangEn } = require('@nlpjs/lang-en-min');
var enCorpus = require('../utils/corpus-en.json');

let nlp_;
async function nlp () {
  const container = await containerBootstrap();
  
  container.use(Nlp);
  container.use(LangEn);

  nlp_ = container.get('nlp');
  nlp_.settings.log = false;
  nlp_.settings.autoSave = false;

  await nlp_.addCorpus(enCorpus);
  await nlp_.train();
};

async function trainNlp (intent, utterances, answers) {
  enCorpus.data.push(
    {
      "intent": intent,
      "utterances": utterances,
      "answers": answers,
    }
  )

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
  const [messages, setMessages] = useState([]);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const [toggledChat, setToggledChat] = useState(false);
  const [animation, setAnimation] = useState(false);

  async function sleep(ms) {
    return await new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function translate(message, locale) {
    return new Promise(async (resolve, reject) => {
      await fetch("http://localhost:3003/translate", {
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify(
          {
            text: message,
            locale: locale
          }
        )
      }) 
      .then(response => response.json())
      .then(data => {
        console.log(data.text);
        resolve(data.text);
      })
      .catch(err => {
        reject(err);
      })

    })
  }

  async function translateEN(message, locale) {
    return new Promise(async (resolve, reject) => {
      await fetch("http://localhost:3003/translateEN", {
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify(
          {
            text: message,
            locale: locale
          }
        )
      }) 
      .then(response => response.json())
      .then(data => {
        console.log(data.text);
        resolve(data.text);
      })
      .catch(err => {
        reject(err);
      })
    })
  }

  async function predict(message) {
    return new Promise(async (resolve, reject) => {
      await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify(
          {
            utterance: message
          }
        )
      }) 
      .then(response => response.json())
      .then(data => {
        console.log(data.text);
        resolve(data.text);
      })
      .catch(err => {
        reject(err);
      })
    })
  }

  async function guessLanguage(message) {
    return new Promise(async (resolve, reject) => {
      await fetch("http://localhost:3003/guessLanguage", {
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify(
          {
            text: message,
          }
        )
      }) 
      .then(response => response.json())
      .then(data => {
        console.log(data.text);
        resolve(data.text);
      })
      .catch(err => {
        reject(err);
      })
    })
  }

  useEffect( () => {
    const run = async () => {
      if (inputValue.length > 0) {
        const locale = await guessLanguage(inputValue);
        console.log(locale);
        let answer;

        setMessages(prev => [
          ...prev,
          <Message 
          model={{
            message: inputValue,
            sentTime: "just now",
            sender: "You"
          }}/>,
        ])
        setInputValue("");

        // COMUNICATION WITH BACKEND
        if (locale !== "en") {
          setTypingIndicator(true);
          const translation = await translateEN(inputValue, locale);
          const response = await nlp_.process(translation)
          answer = await translate(response.answer, locale);
          if (answer == null) answer = await predict(inputValue)
        } else {
          answer = await nlp_.process(inputValue);
          answer = answer.answer;
          if (answer == null) answer = await predict(inputValue)
          setTypingIndicator(true);
          await sleep(2000);
        }
        
        setMessages(prev => [
          ...prev,
          <Message
            model={{
              message: answer,
              sentTime: "just now",
              sender: "Bot",
              direction: "right"
          }}/>
        ])
        setTypingIndicator(false);
      }
    }

    run();
  }, [inputValue, typingIndicator]);
  
  return (
    <div>
      {
      animation ? 
      <img 
        className="scale-animation"
        style=
          {{
            position: "absolute",
            bottom: 30,
            right: 30,
            width: "50px",
            height: "50px",
        }}
        alt="chat"
        src="https://img.icons8.com/ios-filled/50/339AF0/chat.png" 
        onClick={() => {
          if (toggledChat) setToggledChat(false);
          else {
            setToggledChat(true);
            setAnimation(false)
          }
        }}
        onMouseLeave={() => {
          setAnimation(false)
        }}
      />
      :
      <img 
        src="https://img.icons8.com/ios-filled/50/339AF0/chat.png" 
        style=
          {{
            position: "absolute",
            bottom: 30,
            right: 30,
            width: "50px",
            height: "50px",
        }}
        alt="chat" 
        onClick={() => {
          if (toggledChat) setToggledChat(false);
          else setToggledChat(true);
        }}
        onMouseEnter={() => {
          if (!toggledChat) {
            setAnimation(true);
          }
        }}     
        />
      }
      <div 
        className="chat-box"
        style={{ 
          position: "absolute", 
          bottom: 40,
          right: 120,
          height: "600px", 
          width: "400px",
        }}>
        { toggledChat ?
          <MainContainer>
            <ChatContainer>
              <MessageList typingIndicator={typingIndicator && <TypingIndicator content="..." />}>
                {messages}
              </MessageList>
              <MessageInput 
                placeholder="Type message here" 
                attachButton="false" 
                onSend={(value) => {
                  setInputValue(value);
                }}
                />
            </ChatContainer>
          </MainContainer> : <div></div>
        }
      </div>
    </div>
)};

export default App;
