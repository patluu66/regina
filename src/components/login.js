import React from "react";
import GoogleLogin from 'react-google-login';

const LoginButton = props =>
  <GoogleLogin
    className="SignInButton"
    clientId=process.env.clientId
    buttonText="Sign in"
    onSuccess={props.responseGoogle}
    onFailure={props.responseGoogle}
  />

export default LoginButton;
