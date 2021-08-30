import React, { useState } from 'react';
import PropTypes from 'prop-types';
import mime from 'mime-types';
import { Button, Input, Icon, Modal, Message } from 'semantic-ui-react';

const UploadFileModal = ({ open, closeModal, uploadFile }) => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if(file !== null) {
            setFile(file);
        }
    }

    const clearFile = () => setFile(null)

    const isFileAuthorized = (fileName) => 
    ['image/jpeg', 'image/png'].includes(mime.lookup(fileName))

    const handleUpload = () =>{
        if(file !== null) {
            if(isFileAuthorized(file.name)) {
                const metaData = {
                    contentType: mime.contentType(file.name)
                }
    
                uploadFile(file, metaData);
                clearFile();
                closeModal();
            } else {
                setError('This type of file is not allowed. Allowed formats: png, jpeg');
            }
        } else {
            setError('Please select a file. Allowed format: jpg, png');
        }
    }

    return (
        <Modal open={open} onClose={closeModal}>
            <Modal.Header>Select an Image File</Modal.Header>
            <Modal.Content>
                <Input 
                    fluid
                    label='File types: jpg, png'
                    name='file'
                    type='file'
                    onChange={handleFileChange}
                />
                {error && (
                    <Message error>
                        <p>{error}</p>
                    </Message>
                )}
            </Modal.Content>
            <Modal.Actions>
                <Button 
                    color='green' 
                    onClick={handleUpload}
                >
                    <Icon name='checkmark' /> Send
                </Button>
                <Button 
                    color='red' 
                    onClick={closeModal}
                >
                    <Icon name='remove' /> Cancel
                </Button>
            </Modal.Actions>
        </Modal>
    )
}

UploadFileModal.propTypes = {
    open: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    uploadFile: PropTypes.func.isRequired,
}

export default UploadFileModal;
