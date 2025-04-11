import { useState, useEffect } from "react";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@adelespinasse/chat-ui-kit-react";

const { containerBootstrap } = require('@nlpjs/core');
const { Nlp } = require('@nlpjs/nlp');
const { LangEn } = require('@nlpjs/lang-en-min');
const { LangEs } = require('@nlpjs/lang-es');

console.log = function() {}

var enCorpus = require('./corpus-en.json');
var esCorpus = require('./corpus-es.json');

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
  const [messages, setMessages] = useState([]);


  useEffect( () => {
    const run = async () => {
      if (inputValue.length > 0) {
        const language = await nlp_.guessLanguage(inputValue);
        const answer = await nlp_.process(language, inputValue);
        setMessages(prev => [
          ...prev,
          <Message 
            model={{
              message: inputValue,
              sentTime: "just now",
              sender: "You"
            }}/>,
          <Message 
          model={{
            message: answer.answer,
            sentTime: "just now",
            sender: "Bot",
            direction: "right"
          }}/>
        ])

        setInputValue("");
      }
    }

    run();
  });

  return (
    <div style={{ position: "relative", height: "500px", width: "300px" }}>
      <MainContainer>
        <ChatContainer>
          <MessageList>
            {messages}
          </MessageList>
          <MessageInput 
            placeholder="Type message here" 
            attachButton="false" 
            onSend={(value) => {
              setInputValue(value);
            }}/>
        </ChatContainer>
      </MainContainer>
    </div>
)};
