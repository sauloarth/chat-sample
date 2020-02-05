import React from 'react';
import Message from './Message.js';

class MessageList extends React.Component {
  render() {
    const messages = this.props.messages;
    console.log(messages);
    return (
      <div className="message-list">
        {messages.map((mss, index) => {
          return (
            <Message
              key={index}
              senderId={mss.senderId}
              text={mss.parts[0].payload.content}
            />
          );
        })}
      </div>
    );
  }
}

export default MessageList;
