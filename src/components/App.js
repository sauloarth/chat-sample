import React from 'react';
import '../style.css';
import RoomList from './RoomList';
import MessageList from './MessageList';
import SendMessageForm from './SendMessageForm';
import NewRoomForm from './NewRoomForm';
import {ChatManager, TokenProvider} from '@pusher/chatkit-client';
import {tokenUrl, instanceLocator} from '../config';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    };
  }
  componentDidMount() {
    const chatManager = new ChatManager({
      instanceLocator,
      userId: 'Nabuco',
      tokenProvider: new TokenProvider({
        url: tokenUrl,
      }),
    });

    chatManager
      .connect()
      .then((currentUser) => {
        console.log('Successful connection, ', currentUser);
        return currentUser;
      })
      .then((currentUser) => {
        currentUser.subscribeToRoomMultipart({
          roomId: 'df592d48-aed9-461d-81cd-6ec366ea1284',
          hooks: {
            onMessage: (message) => {
              this.setState({
                messages: [...this.state.messages, message],
              });
            },
            onAddedToRoom: (room) => {
              console.log('Added to room ${room.name}');
            },
          },
        });
      })
      .catch((err) => {
        console.log('Error on connection: ', err);
      });
  }

  render() {
    return (
      <div className="app">
        <RoomList />
        <MessageList messages={this.state.messages} />
        <SendMessageForm />
        <NewRoomForm />
      </div>
    );
  }
}

export default App;
