import React from 'react';
import PropTypes from 'prop-types';
import { Header, Icon, Input, Segment } from 'semantic-ui-react';

const MessagesHeader = ({ channelName, numUniqueUsers, privateChannel, handleSearchChange, search, handleStar, isStarred }) => {
    return (
        <Segment clearing>
            <Header fluid='true' as='h2' floated='left' style={{ marginBottom: 0 }}>
                <span>
                    {channelName}
                    {!privateChannel && <Icon 
                        onClick={handleStar}
                        name={isStarred ? 'star' : 'star outline'} 
                        color={isStarred ? 'yellow' : 'black'} />
                    }
                </span>
                {!privateChannel && <Header.Subheader>{numUniqueUsers}</Header.Subheader>}
            </Header>
            <Header floated='right'>
                <Input
                    size='mini'
                    icon='search'
                    loading={search}
                    name='searchTerm'
                    placeholder='Search Messages'
                    onChange={handleSearchChange}
                />
            </Header>
        </Segment>
    )
}

MessagesHeader.propTypes = {
    search: PropTypes.bool.isRequired,
    isStarred: PropTypes.bool.isRequired,
    handleStar: PropTypes.func.isRequired,
    channelName: PropTypes.string.isRequired,
    privateChannel: PropTypes.bool.isRequired,
    numUniqueUsers: PropTypes.string.isRequired,
    handleSearchChange: PropTypes.func.isRequired,
}

export default MessagesHeader;
