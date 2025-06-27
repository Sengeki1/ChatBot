# ChatBot Using Natural Language Processor

A chatbot project built using **Node.js**, **NLP.js** for Natural Language Processing, and **React** for a sleek and modern chat interface.

<p align="center">
  <kbd>
    <img src="https://github.com/user-attachments/assets/818a4284-2412-4c3f-b10a-ca24b0e6b51f"/>
  </kbd>
</p>

---

## Features

- Natural language understanding with [NLP.js](https://github.com/axa-group/nlp.js)
- Real-time chatbot interface using [@chatscope/chat-ui-kit-styles](https://www.npmjs.com/package/@chatscope/chat-ui-kit-styles)
- LLM fallback for questions outside predefined intents (Improvised RAG behavior)
- Themed domain: Games — all core training data focuses on gaming-related topics
- Easy to customize and extend intents, responses, and logic
- Automatic translation

---

## LLM Integration (Improvised RAG)

To enhance the chatbot’s flexibility and handle questions beyond predefined utterances, this project integrates a `Language Model (LLM)` using the transformers library. When the NLP engine (NLP.js) fails to confidently classify an intent, the system falls back to the LLM to generate a contextually relevant response.

This creates an improvised `Retrieval-Augmented Generation (RAG)` setup — grounded answers from a curated game-based dataset when possible, and generative reasoning when not.

## Installation & Running

1. **Clone the repository:**

   ```bash
    git clone https://github.com/Sengeki1/ChatBot.git
   cd ChatBot

2. **Install Dependencies**

  ```bash
    npm install
  ```

3. **Start the chatbot (Backend & Frontend)**

  ```bash
    npm start
  ```

4. **Run LLM Server**

  ```bash
    cd Backend/src
    
    python -m venv env
    source env/bin/activate  # On Windows: env\Scripts\activate
    pip install -r requirements.txt
    
    uvicorn LLM:api --port 8000
  ```
