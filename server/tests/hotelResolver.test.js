import request from 'supertest';
import { app } from '../src/index.js'; // Adjust the path as needed

describe('Hotel Resolvers', () => {
    let token;
    let hotelId;

    beforeAll(async () => {
        // Sign up and log in to get a token
        await request(app)
            .post('/graphql')
            .send({
                query: `
          mutation {
            signup(input: { email: "admin@example.com", password: "Password123", name: "Admin User", role: "admin" }) {
              token
            }
          }
        `,
            });

        const response = await request(app)
            .post('/graphql')
            .send({
                query: `
          mutation {
            login(input: { email: "admin@example.com", password: "Password123" }) {
              token
            }
          }
        `,
            });

        token = response.body.data.login.token;
    });

    it('should create a hotel', async () => {
        console.log('token',token)
        const response = await request(app)
            .post('/graphql')
            .set('authorization', `Bearer ${token}`)
            .send({
                query: `
          mutation {
            createHotel(input: { name: "Test Hotel", description: "123 Test St", price: 1223 , availableRooms:12 }) {
              id
              name
              address
            }
          }
        `,
            });

        console.log('response',response.body.data)
        hotelId = response.body.data.createHotel.id;
        expect(response.body.data.createHotel.name).toBe('Test Hotel');
    });

    it('should update a hotel', async () => {
        const response = await request(app)
            .post('/graphql')
            .set('authorization', `Bearer ${token}`)
            .send({
                query: `
          mutation {
            updateHotel(id: "${hotelId}", input: { name: "Updated Test Hotel" }) {
              id
              name
              address
            }
          }
        `,
            });

        expect(response.body.data.updateHotel.name).toBe('Updated Test Hotel');
    });

    it('should delete a hotel', async () => {
        const response = await request(app)
            .post('/graphql')
            .set('authorization', `Bearer ${token}`)
            .send({
                query: `
          mutation {
            deleteHotel(id: "${hotelId}") {
              id
            }
          }
        `,
            });

        expect(response.body.data.deleteHotel.id).toBe(hotelId);
    });

    it('should fetch a hotel by ID', async () => {
        const response = await request(app)
            .post('/graphql')
            .send({
                query: `
          query {
            hotel(id: "${hotelId}") {
              id
              name
              address
            }
          }
        `,
            });

        expect(response.body.data.hotel).toBeNull();
    });
});