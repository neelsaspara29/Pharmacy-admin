import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import Auth from '../Auth';

const AuthProtected = ({component: Component, ...rest}) => (
    <Route {...rest} render={(props) => (
        Auth.isUserAuthenticated() === true
            ? <Component {...props} />
            : <Redirect to={{
                pathname: '/signin',
                state: {from: props.location}
            }}/>
    )}/>
);

export default AuthProtected;
