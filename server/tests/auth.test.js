import request from 'supertest';
import { app } from '../src/index.js';

describe('Authentication', () => {

    /**
     * Test case for signing up a new user.
     * Sends a GraphQL mutation to sign up a new user and checks if the response contains the correct email.
     */
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

    /**
     * Test case for logging in an existing user.
     * Sends a GraphQL mutation to log in an existing user and checks if the response contains the correct email.
     */
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

    /**
     * Test case for logging in with incorrect credentials.
     * Sends a GraphQL mutation to log in with incorrect credentials and checks if the response contains errors.
     */
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

});