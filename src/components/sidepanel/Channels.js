import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { Button, Label, Form, Icon, Input, Menu, Modal } from 'semantic-ui-react';
import firebase from '../../firebase';
import { setCurrentChannel, setPrivateChannel } from '../../actions/channel';

class Channels extends Component {
    state = {
        activeChannel: '',
        channels: [],
        channel: null,
        channelName: '',
        channelDetails: '',
        channelsRef: firebase.database().ref('channels'),
        messagesRef: firebase.database().ref('messages'),
        typingRef: firebase.database().ref('typing'),
        notifications: [],
        firstLoad: true,
        modal: false,
        user: this.props.currentUser,
        isDrawerOpen: this.props.isDrawerOpen 
    }

    componentDidMount() {
        this.addListeners();
    }

    componentWillUnmount() {
        this.removeListeners();
    }

    addListeners = () => {
        let loadedChannels = [];

        this.state.channelsRef.on('child_added', snap => {
            loadedChannels.push(snap.val());
            this.setState({ channels: loadedChannels}, () => this.setFirstChannel() );
            this.addNotificationListener(snap.key);
        })
    }

    addNotificationListener = (channelId) => {
        this.state.messagesRef.child(channelId).on('value', snap => {
            if(this.state.channel) {
                this.handleNotifications(channelId, this.state.channel.id, this.state.notifications, snap);
            }
        })
    }

    handleNotifications = (channelId, currentChannelId, notifications, snap) => {
        let lastTotal = 0;

        let index = notifications.findIndex(notification => notification.id === channelId);

        if(index !== -1) {
            if(channelId !== currentChannelId) {
                lastTotal = notifications[index].total;

                if(snap.numChildren() - lastTotal > 0) {
                    notifications[index].count = snap.numChildren() - lastTotal;
                }
            }

            notifications[index].lastKnowTotal = snap.numChildren();
        } else {
            notifications.push({
                id: channelId,
                total: snap.numChildren(),
                lastKnowTotal: snap.numChildren(),
                count: 0
            })
        }

        this.setState({ notifications });
    }

    removeListeners = () => {
        this.state.channelsRef.off();
    }

    setFirstChannel = () => {
        const firstChannel = this.state.channels[0];
        if( this.state.firstLoad && this.state.channels.length > 0 ) {
            this.props.setCurrentChannel(firstChannel);
            this.setActiveChannel(firstChannel);
            this.setState({ channel: firstChannel });
        }
        this.setState({ firstLoad: false })
    }

    formValid = ({ channelDetails, channelName }) => 
        channelName && channelDetails

    addChannel = () => {
        const { channelName, channelDetails, channelsRef, user } = this.state;

        const key = channelsRef.push().key;

        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        };

        channelsRef
            .child(key)
            .update(newChannel)
            .then(() => {
                this.setState({ channelName: '', channelDetails: '' });
                this.closeModal();
            })
            .catch(err => {
                console.error(err);
            })
    }

    changeChannel = (channel) => {
        this.setActiveChannel(channel);
        this.state.typingRef
            .child(this.state.channel.id)
            .child(this.state.user.uid)
            .remove();
        this.clearNotifications();
        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);
        this.setState({ channel });

        if(this.state.isDrawerOpen){
            this.props.closeDrawer()
        }
    }

    clearNotifications = () => {
        let index = this.state.notifications.findIndex(notification => notification.id === this.state.channel.id);

        if(index !== -1){
            let updatedNotifications = [...this.state.notifications];
            updatedNotifications[index].total = this.state.notifications[index].lastKnowTotal;
            updatedNotifications[index].count = 0;
            this.setState({ notifications: updatedNotifications });
        }
    }

    setActiveChannel = (channel) => {
        this.setState({ activeChannel: channel.id });
    }

    getNotificationsCount = (channel) => {
        let count = 0;

        this.state.notifications.forEach(notification => {
            if(notification.id === channel.id) {
                count = notification.count;
            }
        });

        if(count > 0) return count;
    } 

    displayChannels = (channels) =>        
        channels.map(channel => (
            <Menu.Item
                key={channel.id}
                onClick={() => this.changeChannel(channel)}
                name={channel.name}
                style={{ opacity: 0.7 }}
                active={channel.id === this.state.activeChannel}
            >
                {this.getNotificationsCount(channel) && (
                    <Label color='red'>{this.getNotificationsCount(channel)}</Label>
                )}
                # {channel.name}
            </Menu.Item>
        ))    

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit = (e) => {
        e.preventDefault();

        if(this.formValid(this.state)){
            this.addChannel();
        }
    }

    openModal = () => {
        this.setState({ modal: true })
        if(this.state.isDrawerOpen){
            this.props.closeDrawer()
        }
    };
    closeModal = () => this.setState({ modal: false });

    render() {
        const { channels, channelName, channelDetails, modal } = this.state;

        return (
            <Fragment>
                <Menu.Menu className='menu'>
                    <Menu.Item>
                        <span>
                            <Icon name='exchange' /> CHANNELS
                        </span>{" "}
                        ({channels.length}) <Icon name='add' style={{ cursor: 'pointer' }} onClick={this.openModal} />
                    </Menu.Item>
                    {channels.length > 0 ? (this.displayChannels(channels)) : (<Menu.Item>No channels added yet!</Menu.Item>)}
                </Menu.Menu>
    
                <Modal basic open={modal} onClose={this.closeModal}>
                <Modal.Header>Add a Channel</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Field>
                            <Input 
                                fluid
                                label='Name of Channel'
                                name='channelName'
                                value={channelName}
                                onChange={this.handleChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Input 
                                fluid
                                label='About the Channel'
                                name='channelDetails'
                                value={channelDetails}
                                onChange={this.handleChange}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='green' inverted onClick={this.handleSubmit}>
                        <Icon name='checkmark' /> Add
                    </Button>
                    <Button color='red' inverted onClick={this.closeModal}>
                        <Icon name='remove' /> Cancel
                    </Button>
                </Modal.Actions>
                </Modal>
            </Fragment>
        )
    }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(Channels);
