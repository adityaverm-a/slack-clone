import React, { useState } from 'react';
import { Button, Form, Grid, GridColumn, Header, Icon, Message, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import firebase from '../../firebase';


const Login = () => {
    const [formData, setData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState('');


    const { email, password } = formData;

    const formIsValid = ({ email, password }) => {
        return email && password;
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

        if(formIsValid(formData)) {
            const errors = [];
            setErrors(errors);
            setLoading(true);

            try{
                await firebase
                    .auth()
                    .signInWithEmailAndPassword(email, password)

                setLoading(false);
            } catch(err) {
                console.error(err);
                setErrors(errors.concat({ message: err.message }));
                setLoading(false);
            }
        } else {
            let error = { message: 'Please fill all the fields' }
            setErrors(errors.concat(error))
        }
    }

    const loginAsDemo = async () => {
        setData({
            email: 'adarsh@gmail.com',
            password: 'adarsh'
        })
        const errors = [];
        setErrors(errors);
        setLoading(true);
        try{
            await firebase
                .auth()
                .signInWithEmailAndPassword(email, password)

            setLoading(false);
        } catch(err) {
            console.error(err);
            setErrors(errors.concat({ message: err.message }));
            setLoading(false);
        }
    }

    return (
        <Grid textAlign='center' verticalAlign='middle' className='app'>
            <GridColumn style={{ maxWidth: 450 }}>
                <Header as='h1' icon color='teal' textAlign='center'>
                    <Icon name='code branch' color='teal' />
                    Login for DevChat
                </Header>
                <Form size='large' onSubmit={handleSubmit}>
                    <Segment stacked>
                        <Form.Input 
                            fluid 
                            name='email' 
                            icon='mail' 
                            iconPosition='left' 
                            placeholder='Email Address' 
                            onChange={handleChange} 
                            type='email' 
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
                        <Button 
                            disabled={loading} 
                            className={loading ? 'loading' : ''} 
                            color='teal' 
                            fluid 
                            size='large'
                        >Login</Button>
                        
                        <h3 className='login-or'> 
                            <div style={{ borderTop: "1px solid #b0b5b5 ", width: '40%' }}></div>
                            <span className='m-1'>Or</span>
                            <div style={{ borderTop: "1px solid #b0b5b5 ", width: '40%' }}></div>
                        </h3>
                        <Button 
                            disabled={loading} 
                            className={loading ? 'loading' : ''} 
                            color='teal' 
                            fluid 
                            size='large'
                            onClick={loginAsDemo}
                        >Login as Demo User</Button>
                    </Segment>
                </Form>
                { errors.length > 0 && (
                    <Message error>
                        {errors.map((error, index) => <p key={index}>{error.message}</p>)}
                    </Message>
                ) }
                <Message>Don't have an Account? <Link to='/register'>Sign up</Link></Message>
            </GridColumn>
        </Grid>
    )
}

export default Login;
