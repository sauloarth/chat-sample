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
      roomId: null,
      messages: [],
      joinableRooms: [],
      joinedRooms: [],
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.subscribeToRoom = this.subscribeToRoom.bind(this);
    this.getRooms = this.getRooms.bind(this);
    this.selectRoom = this.selectRoom.bind(this);
    this.leaveRoom = this.leaveRoom.bind(this);
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
        this.currentUser = currentUser;
        this.getRooms();
      })
      .catch((err) => {
        console.log('Error on connection: ', err);
      });
  }

  sendMessage(message) {
    this.currentUser
      .sendSimpleMessage({
        roomId: this.state.roomId,
        text: message,
      })
      .catch((err) => {
        console.log(`Error sending a message: ${err}`);
      });
  }

  getRooms() {
    this.currentUser
    .getJoinableRooms()
      .then((joinableRooms) => {
        this.setState({
          joinableRooms,
          joinedRooms: this.currentUser.rooms,
        });
        console.log('state now: ', this.state);
      })
      .catch((err) => {
        console.log('Error on retriving joined / joinable rooms: ', err);
      });
  }

  subscribeToRoom(roomId) {
    this.currentUser
      .subscribeToRoomMultipart({
        roomId,
        hooks: {
          onMessage: (message) => {
            this.setState({
              messages: [...this.state.messages, message],
            });
          },
          onAddedToRoom: (room) => {
            console.log(`Added to room ${room.name}`);
          },
        },
      })
      .then(room => {
        this.setState({
          roomId: room.id
        });

        this.getRooms();
      })
      .catch((err) => {
        console.log('Error on subscribing room: ', err);
      });
  }

  selectRoom(roomId) { 
    this.setState({roomId});
    this.getRooms();
  }

  leaveRoom(roomId) {
    this.currentUser.leaveRoom({roomId})
      .then(room => console.log(`Left room ${room.id}.`))
      .catch(err => console.log(`Error leaving room ${roomId} : ${err}`));
    this.getRooms();

    const nextRoom = (this.state.joinedRooms.length > 0) && this.state.joinedRooms[0]; 
    nextRoom && this.selectRoom(nextRoom.id);
    this.getRooms();
  }

  render() {
    return (
      <div className="app">
        <RoomList
          joinableRooms = {this.state.joinableRooms}
          joinedRooms = {this.state.joinedRooms}
          subscribeToRoom = {this.subscribeToRoom}
          activeRoom = {this.state.roomId}
          selectRoom = {this.selectRoom}
          leaveRoom = {this.leaveRoom}
        />
        <MessageList messages={this.state.messages} />
        <SendMessageForm sendMessage={this.sendMessage} />
        <NewRoomForm />
      </div>
    );
  }
}

export default App;
