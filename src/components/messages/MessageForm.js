import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { Button, Input, Segment } from 'semantic-ui-react';
import firebase from '../../firebase';
import UploadFileModal from './UploadFileModal';
import ProgressBar from './ProgressBar';

import { Picker, emojiIndex } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

const MessageForm = ({ currentChannel, currentUser, messagesRef, isProgressBarVisble, privateChannel }) => {
    const [errors, setErrors] = useState([]);
    const [modal, setModal] = useState(false);
    const [message, setMessage] = useState('');
    const [pathToUpload, setPath] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploadState, setUploadState] = useState('');
    const [uploadTask, setUploadTask] = useState(null);
    const [percentUpload, setPercentUpload] = useState(0);
    const [emojiPicker, setEmojiPicker] = useState(false);

    const [storageRef] = useState(firebase.storage().ref());
    const [typingRef] = useState(firebase.database().ref('typing'));

    const messageInputRef = useRef(null);

    useEffect(() => {
        if(uploadTask !== null) {
            uploadTask.on('state_changed', snap => {
                const percentageUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                isProgressBarVisble(percentageUploaded);
                setPercentUpload(percentageUploaded);
            }, err => {
                console.error(err);
                setUploadState('ERROR');
                setUploadTask(null);
                setErrors(errors => [...errors, { message: err.message }]);
            }, () => {
                uploadTask.snapshot.ref.getDownloadURL()
                    .then(downloadedUrl => {
                        sendFileMessage(downloadedUrl, pathToUpload);
                        console.log('here');
                    })
                    .catch(err => {
                        console.log(err);
                        setUploadState('ERROR');
                        setUploadTask(null);
                        setErrors(errors => [...errors, { message: err.message }]);
                      })
            } )
        }

        return () => {
            if (uploadTask !== null) {
              uploadTask.cancel()
              setUploadTask(null)
            }
          }
    }, [uploadTask]);

    const sendFileMessage = (downloadedFileUrl, filePath) => {
        messagesRef()
            .child(filePath)
            .push()
            .set(createMessage(downloadedFileUrl))
            .then(() => {
                setUploadState('DONE')
            })
            .catch(err => {
                console.error(err);
                setErrors(errors => [...errors, { message: err.message }])
            })
    }

    const createMessage = (file = null) => {
        const messageBody = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: currentUser.uid,
                name: currentUser.displayName,
                avatar: currentUser.photoURL
            },
        }

        if(file !== null) {
            messageBody['image'] = file; 
        } else {
            messageBody['content'] = message;
        }

        return messageBody;
    }

    const resetState = () => {
        setMessage('');
        setErrors(errors => []);
    }

    const sendMessage = async () => {
        if(message) {
            setLoading(true);
            try {
                await messagesRef()
                    .child(currentChannel.id)
                    .push()
                    .set(createMessage());

                await typingRef
                    .child(currentChannel.id)
                    .child(currentUser.uid)
                    .remove();

                resetState();
                setLoading(false)
            } catch (err) {
                console.log('Error while sending message', err);
                setLoading(false);
                setErrors(errors => [...errors, { message: err.message }]);
            }
        } else {
            setErrors(errors => [...errors, { message: 'Add a message' }]);
        }
    }

    const getPath = (channelId) => {
        if(privateChannel) {
            return `chat/private/${channelId}`;
        } else {
            return `chat/public`;
        }
    }

    const uploadFile = (file, metaData) => {
        setPath(currentChannel.id);
        const filePath = `${getPath(currentChannel.id)}/${uuid()}.jpg`;
        setUploadState('UPLOADING');
        const fileReference = storageRef.child(filePath).put(file, metaData);
        setUploadTask(fileReference);
    }

    const handleKeyDown = (e) => {
        if(e.ctrlKey && e.keyCode === 13) {
            sendMessage();
        } else if(e.keyCode === 13) {
            sendMessage();
        }

        if(message) {
            typingRef
                .child(currentChannel.id)
                .child(currentUser.uid)
                .set(currentUser.displayName);
        } else {
            typingRef
                .child(currentChannel.id)
                .child(currentUser.uid)
                .remove();
        }
    }

    const handleTogglePicker = () => {
        setEmojiPicker(!emojiPicker);
    }
    const handleAddEmoji = (emoji) => {
        const oldMessage = message;
        const newMessage = colonToUnicode(` ${oldMessage} ${emoji.colons}`);
        setMessage(newMessage);
        setEmojiPicker(false);

        setTimeout(() => {
            messageInputRef.current.focus()
        }, 0);
    }

    const colonToUnicode = (message) => {
        return message.replace(/:[A-Za-z0-9_+-]+:/g, (x) => {
          x = x.replace(/:/g, '')
          let emoji = emojiIndex.emojis[x]
          if (typeof emoji !== 'undefined') {
            let unicode = emoji.native
            if (typeof unicode !== 'undefined') {
              return unicode
            }
          }
          x = ':' + x + ':'
          return x
        })
      }

    const openModal = () => setModal(true);
    const closeModal = () => setModal(false);

    return (
        <Segment className='message__form'>
            {emojiPicker && (
                <Picker 
                    set='apple'
                    className='emojipicker'
                    onSelect={handleAddEmoji}
                    title='Pick your emoji'
                    emoji='point_up'
                />
            )}
            <Input 
                fluid
                name='message'
                value={message}
                style={{ marginBottom: '0.7em' }}
                label={
                    <Button 
                        icon={emojiPicker ? 'close' : 'add' }
                        content={emojiPicker ? 'Close' : null}
                        onClick={handleTogglePicker} 
                    />}
                labelPosition='left'
                ref={messageInputRef}
                placeholder='Write your message   -   [You can also press return or (ctrl + return) to send messages]'
                onKeyDown={handleKeyDown}
                onChange={e => setMessage(e.target.value)}
                className={
                    errors.some(error => error.message.includes('message')) ? 'error' : ''
                }
            />
            <Button.Group icon widths='2'>
                <Button 
                    color='orange'
                    disabled={loading}
                    content='Add Reply'
                    labelPosition='left'
                    icon='edit'
                    onClick={sendMessage}
                />
                <Button 
                    color='teal'
                    disabled={uploadState === 'UPLOADING'}
                    content='Upload Media'
                    labelPosition='right'
                    icon='cloud upload'
                    onClick={openModal}
                />
            </Button.Group>
            <UploadFileModal
                open={modal}
                closeModal={closeModal}
                uploadFile={uploadFile}
            />
            <ProgressBar 
                uploadState={uploadState}
                percentUpload={percentUpload}    
            />
        </Segment>
    )
}

MessageForm.propTypes = {
    currentChannel: PropTypes.object,
    privateChannel: PropTypes.bool.isRequired,
    currentUser: PropTypes.object.isRequired,
    messagesRef: PropTypes.func.isRequired,
    isProgressBarVisble: PropTypes.func,
}

export default MessageForm;
