import './Chat.css';

function Chat ({questions, answers}) {

    let messages = [];
    for (var i = questions.length; i >= 0; i--) {
        messages.push(
            <div className="message">
                <p className='question'>
                    {questions[i]}
                </p>
                <p className='answer'>
                    {answers[i]}
                </p>
            </div>
        );
    }

    return (
        <div className="chat-box">
            {messages}
        </div>
    );
} ;

export default Chat;