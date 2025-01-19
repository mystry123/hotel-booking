import request from 'supertest';
import {app}     from '../src/index.js';

describe('Authentication', () => {

    it('should sign up a new user', async () => {
        const response = await request(app)
            .post('/graphql')
            .send({
                query: `
          mutation {
            signup(input: { email: "test@example.com", password: "Password123", name: "Test User", role:"user" }) {
              token
              user {
                id
                email
                name
              }
            }
          }
        `,
            });

        expect(response.body.data.signup.user.email).toBe('test@example.com');
    });

    it('should log in an existing user', async () => {
        const response = await request(app)
            .post('/graphql')
            .send({
                query: `
          mutation {
            login(input: { email: "test@example.com", password: "Password123" }) {
              token
              user {
                id
                email
                name
              }
            }
          }
        `,
            });
        expect(response.body.data.login.user.email).toBe('test@example.com');
    });

    it('should not log in with incorrect credentials', async () => {
        const response = await request(app)
            .post('/graphql')
            .send({
                query: `
          mutation {
            login(input: { email: "test@example.com", password: "WrongPassword" }) {
              token
              user {
                id
                email
                name
              }
            }
          }
        `,
            });

        expect(response.body.errors).toBeDefined();
    });


    // Add more tests here
});