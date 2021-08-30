import React from 'react';
import { useSelector } from 'react-redux';
import { Grid } from 'semantic-ui-react';
// import ColorPanel from './colorpanel/ColorPanel';
import SidePanel from './sidepanel/SidePanel';
import Messages from './messages/Messages';
import MetaPanel from './metapanel/MetaPanel';

import './App.css';

const App = () => {
  const { isPrivateChannel, currentChannel, currentUser, userPosts } = useSelector(
    ({ auth, channel }) => ({
    isPrivateChannel: channel.isPrivateChannel,
    currentChannel: channel.currentChannel,
    currentUser: auth.currentUser,
    userPosts: channel.userPosts
  }))

  return (
    <Grid columns='equal' className='app' style={{ background: '#eee' }}>
      {/* <ColorPanel 
        key={ currentUser && currentUser.avatar }
        currentUser={currentUser}
      /> */}
      <SidePanel 
        key={ currentUser && currentUser.id }
        isPrivateChannel={isPrivateChannel} 
        currentUser={currentUser} 
      />
      <Grid.Column style={{ marginLeft: 300 }}>
        <Messages 
          key={ currentChannel && currentChannel.id } 
          isPrivateChannel={isPrivateChannel}
          currentChannel={currentChannel} 
          currentUser={currentUser}
        />
      </Grid.Column>
      <Grid.Column width={4} style={{ marginRight: 40 }}>
        <MetaPanel
          key={ currentChannel && currentChannel.details } 
          isPrivateChannel={isPrivateChannel}
          currentChannel={currentChannel}
          userPosts={userPosts}
        />
      </Grid.Column>
    </Grid>
  );
}

export default App;
