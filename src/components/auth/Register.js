import React, { useState } from 'react';
import { Button, Form, Grid, GridColumn, Header, Icon, Message, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import md5 from 'md5';
import firebase from '../../firebase';


const Register = () => {
    const [formData, setData] = useState({
        username: '',
        email: '',
        password: '',
        passwordConfirmation: ''
    });

    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState('');
    const [userRef] = useState(firebase.database().ref('/users'));


    const { username, email, password, passwordConfirmation } = formData;

    const formIsValid = () => {
        let errors = [];
        let error;

        if(isFormEmpty(formData)) {
            error = { message: 'Please fill all fields' };
            setErrors(errors.concat(error));
            return false;
        } else if(!isPasswordValid(formData)) {
            error = { message: 'Password is invalid, must contain atleast 6 characters' };
            setErrors(errors.concat(error));
            return false;
        } else if(!passwordMatch(formData)){
            error = { message: 'Password do not match' };
            setErrors(errors.concat(error));
            return false;
        }
        else {
            return true;
        }
    }

    const isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
        return !username || !email || !password || !passwordConfirmation;
    }

    const isPasswordValid = ({ password, passwordConfirmation }) => {
        if( password.length < 6 || passwordConfirmation.length < 6 ) {
            return false;
        } else {
            return true;
        }
    }

    const passwordMatch = ({ password, passwordConfirmation }) => {
        if( password !== passwordConfirmation ) {
            return false;
        } else {
            return true;
        }
    }

    // const displayErrors = (errors) => {
    //     errors.map((error, index) => <p key={index}>{error.message}</p> )
    // }

    const handleInputError = (errors, inputName) => {
        return errors.some(err =>
            err.message.toLowerCase().includes(inputName.toLowerCase())
          )
            ? 'error'
            : ''
    }

    const handleChange = (e) => {
        setData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(formIsValid()) {
            const errors = [];
            setErrors(errors);
            setLoading(true);

            try{
                const createdUser = await firebase
                    .auth()
                    .createUserWithEmailAndPassword(email, password)

                try {
                    await createdUser.user.updateProfile({
                        displayName: username,
                        photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
                    });

                    await saveUser(createdUser);
                    setLoading(false);
                } catch(err) {
                        console.error(err);
                        setErrors(errors.concat({ message: err.message }));
                        setLoading(false);
                }

            } catch(err) {
                console.error(err);
                setErrors(errors.concat({ message: err.message }));
                setLoading(false);
            }
        }
    }

    const saveUser = (createdUser) =>
    userRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      photoUrl: createdUser.user.photoURL,
    })

    return (
        <Grid textAlign='center' verticalAlign='middle' className='app'>
            <GridColumn style={{ maxWidth: 450 }}>
                <Header as='h1' icon color='blue' textAlign='center'>
                    <Icon name='code branch' color='blue' />
                    Register for DevChat
                </Header>
                <Form size='large' onSubmit={handleSubmit}>
                    <Segment stacked>
                        <Form.Input 
                            fluid 
                            name='username' 
                            icon='user' 
                            iconPosition='left' 
                            placeholder='Username' 
                            onChange={handleChange} 
                            type='text' 
                            value={username} 
                        />
                        <Form.Input 
                            fluid 
                            name='email' 
                            icon='mail' 
                            iconPosition='left' 
                            placeholder='Email Address' 
                            onChange={handleChange} type='email' 
                            value={email} 
                            className={handleInputError(errors, 'email')} 
                        />
                        <Form.Input 
                            fluid 
                            name='password' 
                            icon='lock' 
                            iconPosition='left' 
                            placeholder='Password' 
                            onChange={handleChange} 
                            type='password' 
                            value={password} 
                            className={handleInputError(errors, 'password')} 
                        />
                        <Form.Input 
                            fluid 
                            name='passwordConfirmation' 
                            icon='repeat' 
                            iconPosition='left' 
                            placeholder=' Confirm Password' 
                            onChange={handleChange} 
                            type='password' 
                            value={passwordConfirmation} 
                            className={handleInputError(errors, 'password')} 
                        />
                        <Button 
                            disabled={loading} 
                            className={loading ? 'loading' : ''} 
                            color='blue' 
                            fluid size='large'
                        >Register</Button>
                    </Segment>
                </Form>
                { errors.length > 0 && (
                    <Message error>
                        {errors.map((error, index) => <p key={index}>{error.message}</p>)}
                    </Message>
                ) }
                <Message>Already a User? <Link to='/login'>Sign in</Link></Message>
            </GridColumn>
        </Grid>
    )
}

export default Register;
