import React, { Fragment, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Comment, Segment } from 'semantic-ui-react';
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Skeleton from './Skeleton';
import Message from './Message';
import Typing from './Typing';
import firebase from '../../firebase';
import { useIsMount } from '../../hooks/isMount';
import { useDispatch } from 'react-redux';
import { setUserPosts } from '../../actions/channel';

const MessagesComp = ({ isPrivateChannel, currentChannel, currentUser }) => {
    const isMount = useIsMount();

    const messagesEndRef = useRef(null);

    const [userRef] = useState(firebase.database().ref('users'));
    const [typingRef] = useState(firebase.database().ref('typing'));
    const [messagesRef] = useState(firebase.database().ref('messages'));
    const [connectedRef] = useState(firebase.database().ref('.info/connected'))
    const [privateMessagesRef] = useState(firebase.database().ref('privateMessages'));

    const [channel] = useState(currentChannel);
    const [user] = useState(currentUser);

    const [messages, setMessages] = useState([]);
    const [listeners, setListensers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isStarred, setIsStarred] = useState(false);
    const [typingUsers, setTypingUsers] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [progressBar, setProgressBar] = useState(false);    
    const [searchMessages, setSearchMessages] = useState(false);
    const [messagesLoading, setMessagesLoading] = useState(true);
    
    

    const dispatch = useDispatch();

    useEffect(() => {
        if(user && channel) {
            addListeners(channel);
            addUserStarListener(channel.id, user.uid);
        }

        return () => {
            return removeAllListeners();
        }
    }, []);

    const addListeners = (channel) => {
        addMessagesListener(channel.id);
        typingListener(channel.id);
    }

    const addToListeners = (id, ref, event) => {
        const index = listeners.findIndex(listener => 
            listener.id === id && listener.ref === ref && listener.event === event
        )

        if(index !== -1) {
            const newListener = {id, ref, event}
            setListensers((prevListeners) => [...prevListeners, newListener]);
        }
    }

    const addMessagesListener = (channelId) => {
        getMessagesRef()
            .child(channelId)
            .on('child_added', snap => {
                const message = snap.val();
                if(message) {
                    setMessagesLoading(false);
                    setMessages(messages => [...messages, message]); 
                } else {
                    setMessagesLoading(false);
                }
            });

            addToListeners(channelId, getMessagesRef(), 'child_added')
    }

    const getMessagesRef = () => {
        return isPrivateChannel ? privateMessagesRef : messagesRef;
    }


    const displayMessages = (messages) => (
        messages.length > 0 && messages.map(message => (
            <Message
                key={message.timestamp}
                message={message}
                user={user}
            />
        ))
    )

    const displayMessagesSkeleton = (loading) => (
        loading ? (
            <Fragment>
                {[...Array(9)].map((_, i) => <Skeleton key={i} />)}
                <h6>Start a conversation, we'll fetch the existing messages, if there are any!</h6>
            </Fragment>
        ) : null
    )

    const isProgressBarVisble = (percent) => {
        if(percent > 0) {
            setProgressBar(true);
        }
    }

    const displayChannelName = (channel) => {
        return channel ? `${isPrivateChannel ? '@' : '#'}${channel.name}` : ''
    }

    const countUserPosts = () => {
        const userPosts = messages.reduce((acc, message) => {
            if(message.user.name in acc){
                acc[message.user.name].count += 1;
            } else {
                acc[message.user.name] = {
                    avatar: message.user.avatar,
                    count: 1
                }
            }

            return acc;
        }, {}); 

        dispatch(setUserPosts(userPosts));
    }

    useEffect(() => {
        countUserPosts();

        if (messagesEndRef) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])

    const getUniqueUsers = (messages) => {
        const uniqueUsers = messages.reduce((acc, message) => {
          if (!acc.includes(message.user.name)) {
            acc.push(message.user.name)
          }
          return acc
        }, [])
    
        const numUniqueUsers = uniqueUsers.length
        const areUserPlurals = numUniqueUsers > 1 || numUniqueUsers === 0
        return `${numUniqueUsers} user${areUserPlurals ? 's' : ''}`
      }

      const addUserStarListener = (channelId, userId) => {
          userRef
            .child(userId)
            .child('starred')
            .once('value')
            .then(data => {
                if(data.val() !== null) {
                    const channelIds = Object.keys(data.val());
                    const prevStarred = channelIds.includes(channelId);
                    setIsStarred(prevStarred);
                }
            });
      }

      const handleSearchChange = (e) => {
          setSearchTerm(e.target.value);
          setSearchMessages(true);
      } 

    useEffect(() => {
        const regex = new RegExp(searchTerm, 'gi');
        const results = messages.reduce((acc, message) => {
          if (
            (message.content && message.content.match(regex)) ||
            message.user.name.match(regex)
          ) {
            acc.push(message);
          }
          return acc;
        }, []);
        setSearchResult(results);
        setTimeout(() => setSearchMessages(false), 800);
    }, [searchTerm, messages]);

    const handleStar = () => {
        setIsStarred(!isStarred)
    }

    useEffect(() => {
        if(!isMount) {
            if(isStarred) {
                userRef.child(`${user.uid}/starred`)
                    .update({
                        [channel.id] : {
                            name: channel.name,
                            details: channel.details,
                            createdBy: {
                                name: channel.createdBy.name,
                                avatar: channel.createdBy.avatar,
                            },
                        },
                    })
            } else {
                userRef.child(`${user.uid}/starred/${channel.id}`)
                    .remove((err) => {
                        if(err !== null) {
                            console.error('Error at line 128 in Messages.js', err);
                        }
                    })
            }
        }
    }, [isStarred]);

    const typingListener = (channelId) => {
        let allTypingUsers = [];

        typingRef.child(channelId).on('child_added', snap => {
            if(snap.key !== user.uid) {
                allTypingUsers = allTypingUsers.concat({
                    id: snap.key,
                    name: snap.val(),
                });
                setTypingUsers(allTypingUsers);
            }
        });
        addToListeners(channelId, typingRef, 'child_added');

        typingRef.child(channelId).on('child_removed', snap => {
            const index = allTypingUsers.findIndex((tu) => tu.id === snap.key);

            if(index !== -1) {
                allTypingUsers = allTypingUsers.filter((tu) => tu.id !== snap.key);
                setTypingUsers(allTypingUsers);
            }
        });
        addToListeners(channelId, typingRef, 'child_removed');

        connectedRef.on('value', snap => {
            if(snap.val() === true) {
                typingRef
                    .child(channelId)
                    .child(currentUser.uid)
                    .onDisconnect()
                    .remove(err => {
                        if(err !== null) {
                            console.error(err);
                        }
                    })
            }
        })
    }

    const removeAllListeners = () => {
        listeners.forEach((listener) => {
          listener.ref.child(listener.id).off(listener.event);
        })
    }

    const displayTypingUsers = (users) => {
        return (
          users.length > 0 &&
          users.map((tu) => {
            return (
              <div
                key={tu.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.3em',
                }}
              >
                <span className="user__typing">{tu.name} is typing...</span>
                <Typing />
              </div>
            )
          })
        )
      }


    return (
        <div className='message__container'>
            <MessagesHeader
                channelName={displayChannelName(channel)} 
                numUniqueUsers={getUniqueUsers(messages)}
                handleSearchChange={handleSearchChange}
                privateChannel={isPrivateChannel}
                handleStar={handleStar}
                search={searchMessages}
                isStarred={isStarred}
            />
            <Segment>
                <Comment.Group className={progressBar ? 'messages_progress' : 'messages'}>
                    {displayMessagesSkeleton(messagesLoading)}
                    {searchTerm ? displayMessages(searchResult) : displayMessages(messages)}
                    {displayTypingUsers(typingUsers)}
                    <div ref={messagesEndRef}></div>
                </Comment.Group>
            </Segment>
            <MessageForm 
                currentChannel={channel}
                currentUser={user} 
                messagesRef={getMessagesRef}
                privateChannel={isPrivateChannel}
                isProgressBarVisble={isProgressBarVisble}
            />
        </div>
    )
}

MessagesComp.propTypes = { 
    isPrivateChannel: PropTypes.bool.isRequired,
    currentChannel: PropTypes.object,
    currentUser: PropTypes.object.isRequired
}

export default MessagesComp;
