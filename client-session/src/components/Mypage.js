import React from 'react';
const axios = require('axios');

function Mypage(props) {
  const handleLogout = () => {
    axios.post('https://localhost:4000/users/logout').then(() => {
      props.logoutHandler()
    })
    
  };
  return props.userData == null ? (
    <div>Loading...</div>
  ) : (
      <div>
        <div className='mypageContainer'>
          <div>
            <span className='title'>Mypage</span>
            <button className='logoutBtn' onClick={handleLogout}>
              logout
            </button>
          </div>
          <hr />

          <div>
            안녕하세요. <span className='name'>{props.userData.userId}</span>님! 로그인이 완료되었습니다.
          </div>
          <br />
          <div className='item'>
            나의 유저 네임: {props.userData.userId}
          </div>
          <div className='item'>
            나의 이메일 주소: {props.userData.email}
          </div>
        </div>
      </div>
    );
}

export default Mypage;
