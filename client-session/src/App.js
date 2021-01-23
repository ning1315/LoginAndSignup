import React, { Component } from 'react';
import Login from './components/Login';
import Mypage from './components/Mypage';
import Signup from './components/Signup';
const axios = require('axios');



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
      userData: null,
      isSignup : false
    };
    axios.defaults.withCredentials = true;
    this.loginHandler = this.loginHandler.bind(this);
    this.logoutHandler = this.logoutHandler.bind(this);
    this.setUserInfo = this.setUserInfo.bind(this);
    this.signUpHandler = this.signUpHandler.bind(this)
  }

  signUpHandler() {
    this.setState({
      isSignup : !this.state.isSignup
    })
  }

  loginHandler() {
    this.setState({
      isLogin: true,
    });
  }

  setUserInfo(object) {
    this.setState({ userData: object });
  }


  logoutHandler() {
    this.setState({
      isLogin: false,
    });
  }

  render() {
    const { isLogin, isSignup } = this.state;
    return (
      <div className='App'>
        {
        isSignup ? ( 
          <Signup signUpHandler={this.signUpHandler}></Signup>
        ) : 
        isLogin ? (
          <Mypage
            logoutHandler={this.logoutHandler}
            userData={this.state.userData}
          />
        ) : (
         
            <Login
              loginHandler={this.loginHandler}
              setUserInfo={this.setUserInfo}
              signUpHandler={this.signUpHandler}
            />
          )}
      </div>
    );
  }
}

export default App;