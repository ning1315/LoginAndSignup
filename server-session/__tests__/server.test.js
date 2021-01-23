const app = require('../index');
const request = require('supertest');
const agent = request(app);
const factoryService = require('./helper/FactoryService');
const databaseConnector = require('../lib/databaseConnector');
const DB_CONNECTOR = new databaseConnector();
const { expect, assert } = require('chai');
const { before } = require('mocha');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('Authentication - Server', () => {
  before(async () => {
    await factoryService.init();
    console.log('\n  🏭factory service started.\n');
  });

  describe('Authentication - Database', () => {
    after(async () => {
      await DB_CONNECTOR.terminate();
    });

    it('should connect to database', async () => {
      let response;

      console.log('DB configurations');
      console.table(DB_CONNECTOR['config']);

      try {
        response = await DB_CONNECTOR.init();
      } catch (e) {
        console.log(e);
      }

      assert.strictEqual(response, 'ok');
    });

    it('should have table `Users` in database', async () => {
      await DB_CONNECTOR.init();

      try {
        await DB_CONNECTOR.query('DESCRIBE Users');
      } catch (error) {
        throw error;
      }
    });
  });

  describe('Authentication - Server', () => {
    before(async () => {
      await DB_CONNECTOR.init();
      await factoryService.setup();
      await factoryService.insertTestUser();
    });

    after(async () => {
      await DB_CONNECTOR.terminate();
    });

    describe('⛳️ POST /users/login', () => {
      let failedResponse;
      let correctResponse;

      let resCookies;

      before(async () => {
        failedResponse = await agent.post('/users/login').send({
          userId: 'kimcoding',
          password: 'helloWorld',
        });

        correctResponse = await agent.post('/users/login').send({
          userId: 'kimcoding',
          password: '1234',
        });

        resCookies = correctResponse.header['set-cookie'][0];
      });
      it("invalid userId or password request should respond with message 'not authorized'", async () => {
        expect(failedResponse.body.message).to.eql('not authorized');
      });

      it("valid userId and password request should respond with message 'ok'", async () => {
        expect(correctResponse.body.message).to.eql('ok');
      });

      describe('Cookie options', () => {
        it("invalid userId or password request should respond with message 'not authorized'", () => {
          expect(failedResponse.body.message).to.eql('not authorized');
        });

        it("valid userId and password request should respond with message 'ok'", () => {
          expect(correctResponse.body.message).to.eql('ok');
        });

        it('Cookie should have right Domain cookie option', () => {
          expect(resCookies).include('Domain=localhost;');
        });

        it('Cookie should have right path cookie option', () => {
          expect(resCookies).include('Path=/;');
        });

        it('Cookie should have HttpOnly cookie option', () => {
          expect(resCookies).include('HttpOnly');
        });

        it('Cookie should have Secure cookie option', () => {
          expect(resCookies).include('Secure');
        });

        it('Cookie should have right SameSite cookie option', () => {
          expect(resCookies).include('SameSite=None');
        });
      });

      it('connect.sid cookie value should be set as encrypted value while using express-session', async () => {
        expect(resCookies).include('connect.sid');
      });
    });

    describe('⛳️ POST /users/logout', () => {
      let response;

      let resCookies;

      before(async () => {
        response = await agent.post('/users/login').send({
          userId: 'kimcoding',
          password: '1234',
        });

        resCookies = response.header['set-cookie'][0];
      });

      it('should return code 200 after login', async () => {
        const response = await agent
          .get('/users/userinfo')
          .set('Cookie', resCookies);

        expect(response.status).to.eql(200);
      });

      it('should return code 400 after logout', async () => {
        await agent.post('/users/logout').set('Cookie', resCookies);

        const response = await agent.post('/users/logout');

        expect(response.status).to.eql(400);
      });
    });

    describe('⛳️ GET /users/userinfo', () => {
      let response;

      let resCookies;

      before(async () => {
        response = await agent.post('/users/login').send({
          userId: 'kimcoding',
          password: '1234',
        });

        resCookies = response.header['set-cookie'][0];
      });

      it('should return 200 status code when requested with a valid cookie', async () => {
        const response = await agent
          .get('/users/userinfo')
          .set('Cookie', resCookies);

        expect(response.status).to.eql(200);
        expect(response.body.message).to.eql('ok');
      });

      it('should return 400 status code when requested without a cookie', async () => {
        await agent.post('/users/logout').set('Cookie', resCookies);

        const response = await agent.get('/users/userinfo');

        expect(response.status).to.eql(400);
        expect(response.body.message).to.eql('not authorized');
      });
    });
  });

  after(async () => {
    await factoryService.terminate();
    console.log('\n  🏭factory service terminated.\n');
  });
});
