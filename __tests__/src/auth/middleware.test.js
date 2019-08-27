'use strict';

const app = require('../../../src/app');
const supergoose = require('../../supergoose.js');
const auth = require('../../../src/auth/middleware.js');
const Users = require('../../../src/auth/users-model.js');
const mockRequest = supergoose.server(app.server);

let users = {
  admin: {username: 'admin', password: 'password', role: 'admin'},
  editor: {username: 'editor', password: 'password', role: 'editor'},
  user: {username: 'user', password: 'password', role: 'user'},
};

beforeAll(async (done) => {
  await supergoose.startDB();
  const adminUser = await new Users(users.admin).save();
  const editorUser = await new Users(users.editor).save();
  const userUser = await new Users(users.user).save();
  done();
});

afterAll(supergoose.stopDB);

describe('Auth Middleware', () => {
  
  // admin:password: YWRtaW46cGFzc3dvcmQ=
  // admin:foo: YWRtaW46Zm9v
  
  let errorObject = {'message': 'Invalid User ID/Password', 'status': 401, 'statusMessage': 'Unauthorized'};
  
  describe('user authentication', () => {
    
    let cachedToken;

    it('fails a login for a user (admin) with the incorrect basic credentials', () => {

      let req = {
        headers: {
          authorization: 'Basic YWRtaW46Zm9v',
        },
      };
      let res = {};
      let next = jest.fn();
      let middleware = auth;

      return middleware(req, res, next)
        .then(() => {
          expect(next).toHaveBeenCalledWith(errorObject);
        });

    }); 
    it('signs up a new user with valid information',()=>{
      return mockRequest
        .post('/signup')
        .send({'username':'testUser1', 'password':'fluffybunny', 'role':'user'})
        .then(result=>{
          expect(result.status).toBe(200);
        });
    });

    it('does not sign up up a new user with an already existing username',()=>{
      return mockRequest
        .post('/signup')
        .send({'username':'testUser1', 'password':'fluffybunny', 'role':'user'})
        .then(result=>{
          expect(result.status).toBe(500);
        });
    });

    it('logs in an admin user with the right credentials', () => {

      let req = {
        headers: {
          authorization: 'Basic YWRtaW46cGFzc3dvcmQ=',
        },
      };
      let res = {};
      let next = jest.fn();
      let middleware = auth;

      return middleware(req,res,next)
        .then( () => {
          cachedToken = req.token;
          expect(next).toHaveBeenCalledWith();
        });

    }); 

    it('signs in as an existing user',()=>{
      return mockRequest
        .post('/signin')
        .auth('testUser1','fluffybunny')
        .then(result=>{
          expect(result.status).toBe(200);
        });
    });

    it('successfully sign in into book route',()=>{
      return mockRequest
        .get('/books')
        .auth('testUser1','fluffybunny')
        .then(result=>{
          expect(result.status).toBe(200);
          expect(result.body.results[0].title).toBe('Moby Dick');
        });
    });

    it('failed signing in into book route',()=>{
      return mockRequest
        .get('/books')
        .auth('testUser2','fluffybunny')
        .then(result=>{
          expect(result.status).toBe(401);
        });
    });

    it('successfully sign in into book/:id route',()=>{
      return mockRequest
        .get('/books/1')
        .auth('testUser1','fluffybunny')
        .then(result=>{
          expect(result.status).toBe(200);
          expect(result.body.title).toBe('Moby Dick');
        });
    });

    it('failed signing in into book/:id route',()=>{
      return mockRequest
        .get('/books/1')
        .auth('testUser2','fluffybunny')
        .then(result=>{
          expect(result.status).toBe(401);
        });
    });

    
    
  });

});
