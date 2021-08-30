import React from 'react';
import PropTypes from 'prop-types';
import { Progress } from 'semantic-ui-react';

const ProgressBar = ({uploadState, percentUpload}) => (
    uploadState === 'UPLOADING' && (
        <Progress 
            className='progress__bar'
            percent={percentUpload}
            progress
            indicating
            size='medium'
            inverted
        />
    )
)


ProgressBar.propTypes = {
    uploadState: PropTypes.string.isRequired,
    percentUpload: PropTypes.number.isRequired,
}

export default ProgressBar;
