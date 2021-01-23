import axios from 'axios';
import React, { Component } from 'react';
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
    this.inputHandler = this.inputHandler.bind(this);
    this.loginRequestHandler = this.loginRequestHandler.bind(this);
  }

  inputHandler(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  loginRequestHandler() {

    if(this.state.username === '' || this.state.password === ''){
      return alert('공백임!')
    }

    axios.defaults.withCredentials = true;

    axios.post('https://localhost:4000/users/login', {
      userId : this.state.username,
      password : this.state.password
    }).then((data) => {
      if(data.data.message === 'not authorized'){
         alert('틀렸음!')
         this.setState({
          username: '',
          password : ''
        })
      }  else {
        axios.get('https://localhost:4000/users/userinfo').then((data) => {
          this.props.loginHandler()
            this.props.setUserInfo(data.data.data)
            
          })
      }
    })
  }
 

  render() {
    return (
      <div className='loginContainer'>
        <div className='inputField'>
          <div>Username</div>
          <input
            name='username'
            onChange={(e) => this.inputHandler(e)}
            value={this.state.username}
            type='text'
          />
        </div>
        <div className='inputField'>
          <div>Password</div>
          <input
            name='password'
            onChange={(e) => this.inputHandler(e)}
            value={this.state.password}
            type='password'
          />
        </div>
        <div className='passwordField'>
          <div className="btndiv">
          <button onClick={this.loginRequestHandler} className='loginBtn Btn'>
            Login
          </button>
          <button onClick={this.props.signUpHandler} className="signUpBtn Btn">Sign Up</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;