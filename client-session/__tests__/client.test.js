/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import nock from 'nock';
import React from 'react';
import sinon from 'sinon';

import Login from '../src/components/Login';
import Mypage from '../src/components/Mypage';

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM(
  `<!doctype html><html><body><p>paragraph</p></body></html>`
);

global.window = dom.window;
global.document = dom.window.document;
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
Enzyme.configure({ adapter: new Adapter() });

describe('Authentication - Client', () => {
  const mockUser = {
    username: 'kimcoding',
    password: '1234',
  };

  describe('Mypage Component', () => {
    it('should have userData object from props', () => {
      const userData = { id: 0, userId: 'test', email: 'test@test.com' };
      const wrapper = mount(<Mypage userData={userData} />);

      expect(wrapper.find('.name').text()).to.eql('test');
    });

    it('should send POST `/users/logout` request when logout button is clicked', function (done) {
      const scope = nock('https://localhost:4000')
        .post('/users/logout')
        .reply(200, { data: null, message: 'ok' });

      const wrapper = shallow(<Mypage userData={{}} />);

      wrapper.find('.logoutBtn').simulate('click');
      setTimeout(() => {
        scope.done();

        done();
      }, 500);
    });

    it('logoutHandler should be called after successful logout', function (done) {
      const scope = nock('https://localhost:4000')
        .post('/users/logout')
        .reply(200, { data: null, message: 'ok' });
      let obj = {};
      obj.logoutHandler = function () { };

      let spy = sinon.spy(obj, 'logoutHandler');

      const wrapper = shallow(
        <Mypage logoutHandler={obj.logoutHandler} userData={{}} />
      );

      wrapper.find('.logoutBtn').simulate('click');
      setTimeout(() => {
        expect(spy.callCount).to.eql(1);

        spy.restore();
        scope.done();
        done();
      }, 500);
    });
  });

  describe('Login Component', () => {
    it('should send POST `/login` when login button is clicked', (done) => {
      let scope = nock('https://localhost:4000').post('/users/login').reply(
        200,
        { data: null, message: 'ok' },
        {
          'Set-Cookie': `connect.sid=fakeSessionId; path='/'; Secure; HttpOnly=true; SameSite=none;`,
        }
      );

      const wrapper = mount(<Login loginHandler={() => { }} />);

      wrapper.setState(mockUser);
      wrapper.find('.loginBtn').simulate('click');

      setTimeout(() => {
        scope.done();

        done();
      }, 500);
    });

    it('loginHandler should be called after successful login', (done) => {
      nock('https://localhost:4000').post('/users/login').reply(
        200,
        { data: null, message: 'ok' },
        {
          'Set-Cookie': `connect.sid=fakeSessionId; path='/'; Secure; HttpOnly=true; SameSite=none;`,
        }
      );

      let obj = {};
      obj.loginHandler = function () { };

      let spy = sinon.spy(obj, 'loginHandler');

      const wrapper = mount(<Login loginHandler={obj.loginHandler} />);

      wrapper.setState(mockUser);
      wrapper.find('.loginBtn').simulate('click');

      setTimeout(() => {
        expect(spy.callCount).to.eql(1);

        done();
      }, 500);
    });

    it('should send GET `/users/userinfo` after successful login', (done) => {
      nock('https://localhost:4000').post('/users/login').reply(
        200,
        { data: null, message: 'ok' },
        {
          'Set-Cookie': `connect.sid=fakeSessionId; path='/'; Secure; HttpOnly=true; SameSite=none;`,
        }
      );

      const mypageScope = nock('https://localhost:4000')
        .get('/users/userinfo')
        .reply(200, {
          data: {
            id: 2,
            userId: 'kimcoding',
            email: 'kimcoding@authstates.com',
          },
          message: 'ok',
        });

      let obj = {};
      obj.setUserInfo = function () { };
      obj.loginHandler = function () { };

      const wrapper = mount(
        <Login loginHandler={obj.loginHandler} setUserInfo={obj.setUserInfo} />
      );

      wrapper.setState(mockUser);
      wrapper.find('.loginBtn').simulate('click');

      setTimeout(() => {
        mypageScope.done();
        done();
      }, 500);
    });

    it('setUserInfo should be called after a successful GET `/users/userinfo` request', (done) => {
      nock('https://localhost:4000').post('/users/login').reply(
        200,
        { data: null, message: 'ok' },
        {
          'Set-Cookie': `connect.sid=fakeSessionId; path='/'; Secure; HttpOnly=true; SameSite=none;`,
        }
      );

      nock('https://localhost:4000')
        .get('/users/userinfo')
        .reply(200, {
          data: {
            id: 2,
            userId: 'kimcoding',
            email: 'kimcoding@authstates.com',
          },
          message: 'ok',
        });

      let obj = {};
      obj.setUserInfo = function () { };
      obj.loginHandler = function () { };

      let spy = sinon.spy(obj, 'setUserInfo');

      const wrapper = mount(
        <Login loginHandler={obj.loginHandler} setUserInfo={obj.setUserInfo} />
      );

      wrapper.setState(mockUser);
      wrapper.find('.loginBtn').simulate('click');

      setTimeout(() => {
        expect(spy.callCount).to.eql(1);
        done();
      }, 500);
    });
  });
});