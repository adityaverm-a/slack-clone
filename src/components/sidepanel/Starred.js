import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon, Menu } from 'semantic-ui-react';
import { setCurrentChannel, setPrivateChannel } from '../../actions/channel';
import firebase from '../../firebase';

const Starred = ({ currentUser }) => {
    const [starredChannels, setStarredChannels] = useState([]);
    const [activeChannel, setActiveChannel] = useState('');

    const [userRef] = useState(firebase.database().ref('users'));

    const dispatch = useDispatch();

    useEffect(() => {
        userRef
            .child(currentUser.uid)
            .child('starred')
            .on('child_added' , snap => {
                const starredChannel = { id: snap.key, ...snap.val() };

                setStarredChannels(starredChannels => [
                    ...starredChannels,
                    starredChannel
                ])
            });

        return  () => {
            userRef.child(`${currentUser.uid}/starred`).off();
        }
    }, []);

    useEffect(() => {
        userRef
            .child(currentUser.uid)
            .child('starred')
            .on('child_removed', snap => {
                const unStarredChannel = { id: snap.key, ...snap.val() };
                const filteredChannels = starredChannels.filter(channel => channel.id !== unStarredChannel.id);

                setStarredChannels(filteredChannels);
            });

        return () => {
            userRef.child(`${currentUser.uid}/starred`).off();
        }
    }, [starredChannels]);

    const setChannelAsActive = (channel) => {
        setActiveChannel(channel.id);
    }

    const changeChannel = (channel) => {
        setChannelAsActive(channel);
        dispatch(setCurrentChannel(channel));
        dispatch(setPrivateChannel(false));
    }

    const displayChannels = (starredChannels) =>        
        starredChannels.map(channel => (
            <Menu.Item
                key={channel.id}
                onClick={() => changeChannel(channel)}
                name={channel.name}
                style={{ opacity: 0.7 }}
                active={channel.id === activeChannel}
            >
                # {channel.name}
            </Menu.Item>
        )) 

    return (
        <Menu.Menu className='menu'>
            <Menu.Item>
                <span>
                    <Icon name='star' /> STARRED
                </span>{" "}
                ({starredChannels.length})
            </Menu.Item>
            {starredChannels.length > 0 ? (displayChannels(starredChannels)) : (
                <Menu.Item>No Starred channels!</Menu.Item>
            )}
        </Menu.Menu>
    )
}

Starred.propTypes = {
    currentUser: PropTypes.object,
}

export default Starred;
