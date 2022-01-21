import React, { useState } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import { Icon } from 'semantic-ui-react'
import Drawer from './Drawer'

const MobileSideBar = ({ children, isDrawerOpen, setIsDrawerOpen }) => {

    return (
        <Drawer
            width='252px'
            drawerHandler={
                <div className='drawerHandler'>
                    <Icon name='bars' size='large' color='black' />
                </div>
            }
            open={isDrawerOpen}
            closeButton={<Icon name='close' size='large' />}
            toggleHandler={() => setIsDrawerOpen((isDrawerOpen) => !isDrawerOpen)}
        >
            <Scrollbars autoHide>
                    {children}
            </Scrollbars>
        </Drawer>
    )
}

export default MobileSideBar