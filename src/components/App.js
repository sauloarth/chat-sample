import React from 'react';
import '../style.css';
import RoomList from './RoomList';
import MessageList from './MessageList';
import SendMessageForm from './SendMessageForm';
import NewRoomForm from './NewRoomForm';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
import { tokenUrl, instanceLocator } from '../config';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      roomId: null,
      messages: [],
      joinableRooms: [],
      joinedRooms: [],
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.subscribeToRoom = this.subscribeToRoom.bind(this);
    this.getRooms = this.getRooms.bind(this);
    this.leaveRoom = this.leaveRoom.bind(this);
    this.createRoom = this.createRoom.bind(this);
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
      .then(currentUser => {
        console.log('Successful connection, ', currentUser);
        this.currentUser = currentUser;
        this.getRooms();
      })
      .catch(err => {
        console.log('Error on connection: ', err);
      });
  }

  sendMessage(message) {
    this.currentUser
      .sendSimpleMessage({
        roomId: this.state.roomId,
        text: message,
      })
      .catch(err => {
        console.log(`Error sending a message: ${err}`);
      });
  }

  getRooms() {
    this.currentUser
      .getJoinableRooms()
      .then(joinableRooms => {
        this.setState({
          joinableRooms,
          joinedRooms: this.currentUser.rooms,
        });
        console.log('state now: ', this.state);
      })
      .catch(err => {
        console.log('Error on retriving joined / joinable rooms: ', err);
      });
  }

  subscribeToRoom(roomId) {
    this.currentUser
      .subscribeToRoomMultipart({
        roomId,
        hooks: {
          onMessage: message => {
            this.setState({
              messages: [...this.state.messages, message],
            });
          },
          onAddedToRoom: room => {
            console.log(`Added to room ${room.name}`);
          },
        },
      })
      .then(room => {
        this.setState({
          roomId: room.id,
        });

        this.getRooms();
      })
      .catch(err => {
        console.log('Error on subscribing room: ', err);
      });
  }

  leaveRoom(roomId) {
    this.currentUser
      .leaveRoom({ roomId })
      .then(room => {
        console.log(`Left room ${room.id}.`);
        this.setState({
          joinedRooms: joinedRooms.filter(room => {
            !room.id === roomId;
          }),
        });
        this.getRooms();
      })
      .catch(err => console.log(`Error leaving room ${roomId} : ${err}`));

    const nextRoom =
      this.state.joinedRooms.length > 0 && this.state.joinedRooms[0];
    nextRoom && this.subscribeToRoom(nextRoom.id);
    this.getRooms();
  }

  createRoom(roomName) {
    this.currentUser
      .createRoom({
        name: roomName,
      })
      .then(room => {
        console.log(`Success creating a room ${room.name}`);
        this.getRooms();
      })
      .catch(err => console.log(`Error creating room: ${err}`));
  }

  render() {
    return (
      <div className='app'>
        <RoomList
          joinableRooms={this.state.joinableRooms}
          joinedRooms={this.state.joinedRooms}
          subscribeToRoom={this.subscribeToRoom}
          activeRoom={this.state.roomId}
          leaveRoom={this.leaveRoom}
          roomId={this.state.roomId}
        />
        <MessageList messages={this.state.messages} />
        <SendMessageForm sendMessage={this.sendMessage} />
        <NewRoomForm createRoom={this.createRoom} />
      </div>
    );
  }
}

export default App;
