import React, { useState, useContext } from 'react';
import api from '../../services/api'
import {  Alert,Button, Form, FormGroup, Input , Container} from 'reactstrap';
import { UserContext } from '../../user-context'


export default function Login({ history }){
    const { setIsLoggedIn }=  useContext(UserContext);
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("false")

    const handleSubmit = async evt => {
        evt.preventDefault();
        //console.log('Result:' ,email , password)
        const response = await api.post('/login', { email, password})
        const user_id = response.data.user_id || false;
        const user = response.data.user || false;

        try {
            
            if(user && user_id){
                localStorage.setItem('user',user)
                localStorage.setItem('user_id',user_id)
                setIsLoggedIn(true);
                history.push('/');
            } else {
                const { message } = response.data
                setError(true)
                setErrorMessage(message)
                //console.log(message)
                setTimeout(() => {
                    setError(false)
                    setErrorMessage("")
                }, 2000)
            }

        } catch (error) {
            setError(true)
            setErrorMessage("error, the server returned an error")
        }
    }

    return(
        <Container>
            <h2>Login Page</h2>
            <p style={{textAlign:'center'}}>Please <strong>Login</strong> to your account or create a <strong>New Account</strong></p>
            <Form  onSubmit={handleSubmit}>
                <div  className="input-group">
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <Input type="email" name="email" id="email" placeholder="Your email" onChange={evt => setEmail(evt.target.value)} />
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <Input type="password" name="password" id="password" placeholder="Your password" onChange={evt => setPassword(evt.target.value)} />
                </FormGroup>
                </div>
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '8vh'}} >
                <FormGroup>
                    <Button className="submit-btn">Login</Button>
                </FormGroup>
                </div>
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '10vh'}} >
                <FormGroup>
                    <Button className="secondary-btn" onClick={() => history.push("/register")}>New Account</Button>
                </FormGroup>
                </div>
            </Form>
            {error ? (
                <Alert className="event-validation" color="danger"> {errorMessage}</Alert>
            ) : ""}
        </Container>
    );
}

