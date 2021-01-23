import React, { Component } from 'react';
const axios = require('axios');

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      email : '',
    };
    this.inputHandler = this.inputHandler.bind(this); 
    this.signUpHandler = this.signUpHandler.bind(this);
  }

  inputHandler(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  signUpHandler() {
    axios.post('https://localhost:4000/users/signup', {
      data : {
        userId : this.state.username,
        password : this.state.password,
        email : this.state.email
      }
    }).then((data) => {
      if(data.data.message === 'ok'){
        this.props.signUpHandler()
      } else if(data.data.message === 'already'){
        alert('이미 존재하는 아이디입니다')
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
          <div className='inputField'>
          <div>Email</div>
          <input
            name='email'
            onChange={(e) => this.inputHandler(e)}
            value={this.state.email}
            type='text'
          />
        </div>
        
        <div className='passwordField'>
          <div className="btndiv">
          
          <button onClick={this.signUpHandler} className="signUpBtn">Sign Up</button>
          <button onClick={this.props.signUpHandler} className='loginBtn'>
            Back
          </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Signup;