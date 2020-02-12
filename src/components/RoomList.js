import React from 'react';

class RoomList extends React.Component {
  render() {
    const joinedRooms = this.props.joinedRooms;
    const joinableRooms = this.props.joinableRooms;

    return (
      <div className='rooms-list'>
        <ul>
          <h3>Subscribed Rooms:</h3>
          {joinedRooms.length > 0 &&
            this.props.joinedRooms.map(room => {
              return (
                <li key={room.id} className='room'>
                  <a
                    href='#'
                    onClick={() => this.props.subscribeToRoom(room.id)}
                  >
                    # {room.name}
                  </a>
                  <a href='#' onClick={() => this.props.leaveRoom(room.id)}>
                    {' '}
                    X
                  </a>
                </li>
              );
            })}
        </ul>
        <ul>
          <h3>Join also:</h3>
          {joinableRooms.length > 0 &&
            this.props.joinableRooms.map(room => {
              return (
                <li key={room.id} className='room'>
                  <a
                    href='#'
                    onClick={() => this.props.subscribeToRoom(room.id)}
                  >
                    # {room.name}
                  </a>
                </li>
              );
            })}
        </ul>
      </div>
    );
  }
}

export default RoomList;
