import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Grid, Menu, Segment, Sidebar } from 'semantic-ui-react';
import UserPanel from './UserPanel';
import Channels from './Channels';
import DirectMessages from './DirectMessages';
import Starred from './Starred';
import { useEffect } from 'react';
import MobileSideBar from '../MobileSideBar';

const SidePanel = ({ currentUser, isPrivateChannel }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const closeDrawer = () => {
        setIsDrawerOpen(false)
    }

    const sideBar = (
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
            <Channels 
                currentUser={currentUser}
                closeDrawer={closeDrawer}
                isDrawerOpen={isDrawerOpen}
            />
            <DirectMessages 
                currentUser={currentUser} 
                isPrivateChannel={isPrivateChannel} 
                closeDrawer={closeDrawer}
                isDrawerOpen={isDrawerOpen}
            />
        </Menu>
    )


    return (
        <>
            <div className='sidePanel'>
                {sideBar}
            </div>
            <MobileSideBar
                isDrawerOpen={isDrawerOpen}
                setIsDrawerOpen={setIsDrawerOpen}
            >
                {sideBar}
            </MobileSideBar>
        </>
            
    )
}

SidePanel.propTypes = {
    currentUser: PropTypes.object,
    isPrivateChannel: PropTypes.bool.isRequired,
}

export default SidePanel;
