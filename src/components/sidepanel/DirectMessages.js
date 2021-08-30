import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon, Menu } from 'semantic-ui-react';
import firebase from '../../firebase';
import { setCurrentChannel, setPrivateChannel } from '../../actions/channel';

const DirectMessages = ({ currentUser, isPrivateChannel}) => {
    const [userRef] = useState(firebase.database().ref('users'))
    const [connectedRef] = useState(firebase.database().ref('.info/connected'))
    const [presenceRef] = useState(firebase.database().ref('presence'))

    const [users, setUsers] = useState([]);
    const [activeChannel, setActiveChannel] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {
        const addListeners = (currentUserId) => {
            let loadedUsers = []; 
            userRef.on('child_added', snap => {
                if(currentUserId !== snap.key) {
                    let user = snap.val();
                    user['uid'] = snap.key;
                    user['status'] = 'offline';
                    loadedUsers.push(user);
                    setUsers(loadedUsers);
                }
            });
    
            connectedRef.on('value', snap => {
                if(snap.val() === true) {
                    const ref = presenceRef.child(currentUserId);
                    ref.set(true);
                    ref.onDisconnect().remove(err => {
                        if(err !== null) {
                            console.error(err);
                        }
                    })
                }
            });
        }

        if( currentUser ) {
            addListeners(currentUser.uid);
        }

        return () => {
            userRef.off();
            connectedRef.off();
        }
    }, [userRef, connectedRef]);

    useEffect(() => {
        const setUserStatus = (userId, connected = true) => {
            setUsers((prevUsers) => {
                return prevUsers.map((user) => {
                    if(user.uid === userId) {
                        user['status'] = `${connected ? 'online' : 'offline'}`;
                    }
                    return user;
                })
            })
        }

        presenceRef.on('child_added', snap => {
            if(currentUser.uid !== snap.key) {
                setUserStatus(snap.key);
            }
        });

        presenceRef.on('child_removed', snap => {
            if(currentUser.uid !== snap.key) {
                setUserStatus(snap.key, false);
            }
        });

        return () => {
            presenceRef.off();
        }
    }, []);

    

    const changeChannel = (user) => {
        const channelId = getChannelId(user.uid);
        const channelData = {
            id: channelId,
            name: user.name
        }

        dispatch(setCurrentChannel(channelData));
        dispatch(setPrivateChannel(true));
        setChannelAsActive(user.uid);
    }

    const getChannelId = (userId) => {
        const currentUserId = currentUser.uid;
        return userId < currentUserId ? 
            `${userId}/${currentUserId}` : `${currentUserId}/${userId}`;
    }  

    const setChannelAsActive = (userId) => {
        setActiveChannel(userId);
    }

    const isUserOnline = (user) => user.status === 'online'

    const isActive = userId => {
        if(isPrivateChannel) {
            return userId === activeChannel
        }
    }

    return (
        <Menu.Menu className='menu'>
            <Menu.Item>
                <span>
                    <Icon name='mail' /> DIRECT MESSAGES
                </span>{" "}
                ({ users.length })
            </Menu.Item>
            {users.map(user => (
                <Menu.Item
                    key={user.uid}
                    active={isActive(user.uid)}
                    onClick={() => changeChannel(user)}
                    style={{ opacity: 0.7, fontStyle: 'italic' }}
                >
                    <Icon 
                        name='circle'
                        color={isUserOnline(user) ? 'green' : 'red'}
                    />
                    @ {user.name}
                </Menu.Item>
            ))}
        </Menu.Menu>
    )
}

DirectMessages.propTypes = {
    currentUser: PropTypes.object.isRequired,
    isPrivateChannel: PropTypes.bool.isRequired,
}

export default DirectMessages;
