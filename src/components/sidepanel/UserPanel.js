import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown, Grid, Header, Icon, Image, Input, Modal } from 'semantic-ui-react';
import AvatarEditor from 'react-avatar-editor';
import firebase from '../../firebase';

const UserPanel = ({ currentUser }) => {
    const [user] = useState(currentUser);
    const [blob, setBlob] = useState('');
    const [modal, setModal] = useState(false);
    const [croppedImage, setCroppedImage] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadedCroppedImage, setUploadedCroppedImage] = useState('')

    const [storageRef] = useState(firebase.storage().ref());
    const [authUser] = useState(firebase.auth().currentUser);
    const [userRef] = useState(firebase.database().ref('users'));

    let avatarEditor;
    const metaData = {
        'contentType': 'image/jpeg',
    }

    const handleSignOut = () => firebase.auth().signOut();

    const dropdownOptions = () => [
        {
            key: 'user',
            text: <span>Signed in as <strong>{user.displayName}</strong></span>,
            disabled: true
        },
        {
            key: 'avatar',
            text: <span onClick={openModal}>Change Avatar</span>
        },
        {
            key: 'signout',
            text: <span onClick={handleSignOut}>Sign Out</span>
        }
    ]

    const handleChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        if(file) {
            reader.readAsDataURL(file);
            reader.addEventListener("load", () => {
                setPreviewImage(reader.result);
            });
        }
    }

    const handleCropImage = () => {
        if(avatarEditor) {
            avatarEditor.getImageScaledToCanvas().toBlob(blob => {
                let imageUrl = URL.createObjectURL(blob);
                setCroppedImage(imageUrl);
                setBlob(blob);
            })
        }
    }

    const uploadCroppedImage = () => {
        setUploadingImage(true)

        storageRef
            .child(`avatars/users/${user.uid}`)
            .put(blob, metaData)
            .then(snap => {
                snap.ref.getDownloadURL().then(async downloadedUrl => {
                setUploadedCroppedImage(downloadedUrl)
                })
            })
    }

    useEffect(() => {
        if(uploadedCroppedImage) {
            changeAvatar();
        }
    }, [uploadedCroppedImage]);

    const changeAvatar = async () => {
        try {
            await authUser
                .updateProfile({
                    photoURL: uploadedCroppedImage
                });

            await userRef
                .child(user.uid)
                .update({ 
                    photoUrl: uploadedCroppedImage
                 });

            setUploadingImage(false);
            closeModal();
        } catch (err) {
            console.error(err);
        }
    }
    
    const openModal = () => setModal(true)
    const closeModal = () => setModal(false)

    return (
        <Grid style={{ backgound: '#4c3c4c' }}>
            <Grid.Column>
                <Grid.Row style={{ padding: '1.2em', margin: 0}}>
                    <Header inverted floated='left' as='h2'>
                        <Icon name='code' />
                        <Header.Content>DevChat</Header.Content>
                    </Header>
                    <Header style={{ padding: '0.25em', marginBottom: '1em' }} as='h4' inverted>
                        <Dropdown 
                            trigger={
                                <span>
                                    <Image src={user.photoURL} spaced='right' avatar />
                                    {user.displayName}
                                </span>
                            } 
                            options={dropdownOptions()}
                        />
                    </Header>
                </Grid.Row>

                <Modal basic open={modal} onClose={closeModal}>
                    <Modal.Header>Change Avatar</Modal.Header>
                    <Modal.Content>
                            <Input 
                                fluid
                                type='file'
                                label='New Avatar'
                                name='previewImage'
                                onChange={handleChange}
                            />
                            <Grid centered stackable columns="2">
                                <Grid.Row centered>
                                    <Grid.Column className='ui centered align grid'>
                                        {previewImage && (
                                            <AvatarEditor 
                                                ref={node => (avatarEditor = node)}
                                                image={previewImage}
                                                width={220}
                                                height={220}
                                                border={20}
                                                scale={1.1}
                                            />
                                        )}
                                    </Grid.Column>
                                    <Grid.Column>
                                        {croppedImage && (
                                            <Image 
                                                style={{ margin: '3.5em auto' }}
                                                width={200}
                                                height={200}
                                                src={croppedImage}
                                            />
                                        )}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                    </Modal.Content>
                    <Modal.Actions>
                        {croppedImage && (<Button 
                            color='green' 
                            inverted 
                            loading={uploadingImage}
                            onClick={uploadCroppedImage}
                        >
                            <Icon name='save' /> Change Avatar
                        </Button>)}
                        <Button color='teal' inverted onClick={handleCropImage}>
                            <Icon name='image' /> Preview Avatar
                        </Button>
                        <Button color='red' inverted onClick={closeModal}>
                            <Icon name='remove' /> Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </Grid.Column>
        </Grid>
    )
}

UserPanel.propTypes = {
    currentUser: PropTypes.object
}

export default UserPanel;
