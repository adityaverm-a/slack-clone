import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Accordion, Header, Icon, Image, List, Segment } from 'semantic-ui-react';

const MetaPanel = ({ currentChannel, isPrivateChannel, userPosts }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const getPostText = (count) => count > 1 || count === 0 ? `${count} posts` : `${count} post`

    const displayUserPosts = (posts) => {
        return Object.entries(posts)
            .sort((a, b) => b[1].count - a[1].count)
            .map(([key, val], i) => (
                <List.Item key={i}>
                    <Image avatar src={val.avatar} />
                    <List.Content>
                        <List.Header as='a'>{key}</List.Header>
                        <List.Description>{getPostText(val.count)}</List.Description>
                    </List.Content>
                </List.Item>
            ))
            .slice(0, 5);
    }

    const handleAccordionChange = (e, titleProps) => {
        const { index } = titleProps;
        const newIndex = activeIndex === index ? -1 : index;

        setActiveIndex(newIndex);
    }

    if(isPrivateChannel) {
        return null;
    }

    return (
        <Segment loading={!currentChannel}>
            <Header as='h3' attached='top'>
                About #{currentChannel && currentChannel.name}
            </Header>
            <Accordion styled attached='true'>
                <Accordion.Title
                    active={activeIndex === 0}
                    index={0}
                    onClick={handleAccordionChange}
                >
                    <Icon name='dropdown' />
                    <Icon name='info' />
                    Channel Details
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 0}>
                    {currentChannel && currentChannel.details}
                </Accordion.Content>

                <Accordion.Title
                    active={activeIndex === 1}
                    index={1}
                    onClick={handleAccordionChange}
                >
                    <Icon name='dropdown' />
                    <Icon name='user circle' />
                    Top Posters
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 1}>
                    <List>{userPosts && displayUserPosts(userPosts)}</List>
                </Accordion.Content>

                <Accordion.Title
                    active={activeIndex === 2}
                    index={2}
                    onClick={handleAccordionChange}
                >
                    <Icon name='dropdown' />
                    <Icon name='pencil alternate' />
                    Created By
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 2}>
                    <Header as='h3'>
                        <Image circular src={currentChannel && currentChannel.createdBy.avatar} />
                        {currentChannel && currentChannel.createdBy.name}
                    </Header>
                </Accordion.Content>
            </Accordion>
        </Segment>
    )
}

MetaPanel.propTypes = {
    isPrivateChannel: PropTypes.bool.isRequired,
    currentChannel: PropTypes.object,
    userPosts: PropTypes.object,
}

export default MetaPanel;
