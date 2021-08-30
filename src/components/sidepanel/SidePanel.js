import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Grid, Menu, Segment, Sidebar } from 'semantic-ui-react';
import UserPanel from './UserPanel';
import Channels from './Channels';
import DirectMessages from './DirectMessages';
import Starred from './Starred';

const SidePanel = ({ currentUser, isPrivateChannel }) => {

    return (
        <Menu
            inverted
            size="large"
            color="black"
            fixed="left"
            vertical
            style={{ background: '#4c3c4c', fontSize: '1.2rem' }}
        >
            <UserPanel currentUser={currentUser} />
            <Starred currentUser={currentUser} />
            <Channels currentUser={currentUser} />
            <DirectMessages currentUser={currentUser} isPrivateChannel={isPrivateChannel} />
        </Menu>
    )
}

SidePanel.propTypes = {
    currentUser: PropTypes.object,
    isPrivateChannel: PropTypes.bool.isRequired,
}

export default SidePanel;

