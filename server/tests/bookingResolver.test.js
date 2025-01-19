import request from 'supertest';
import { app } from '../src/index.js'; // Adjust the path as needed

describe('Booking Resolvers', () => {
    let token;
    let bookingId;
    let roomId;
    let hotelId;
    let userId;

    beforeAll(async () => {
        // Sign up and log in to get a token
        await request(app)
            .post('/graphql')
            .send({
                query: `
          mutation {
            signup(input: { email: "user@example.com", password: "Password123", name: "User", role: "admin" }) {
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
            login(input: { email: "user@example.com", password: "Password123" }) {
              token
              user{
              id
              }
            }
          }
        `,
            });

        token = response.body.data.login.token;
        userId = response.body.data.login.user.id;

        // Create a hotel to use in room creation
        const hotelResponse = await request(app)
            .post('/graphql')
            .set('authorization', `Bearer ${token}`)
            .send({
                query: `
          mutation {
            createHotel(input: { name: "Test Hotel", description: "123 Test St", price: 1223, availableRooms: 12 }) {
              id
            }
          }
        `,
            });

        hotelId = hotelResponse.body.data.createHotel.id;

        // Create a room to use in booking
        const roomResponse = await request(app)
            .post('/graphql')
            .set('authorization', `Bearer ${token}`)
            .send({
                query: `
          mutation {
            createRoom(input: { hotelId: "${hotelId}", roomType: "Deluxe", price: 200, features: ["WiFi", "TV"] }) {
              id
            }
          }
        `,
            });

        roomId = roomResponse.body.data.createRoom.id;
    });

    it('should create a booking', async () => {
        const response = await request(app)
            .post('/graphql')
            .set('authorization', `Bearer ${token}`)
            .send({
                query: `
          mutation {
            createBooking(input: { roomId: "${roomId}", startDate: "2023-12-01T00:00:00.000Z", endDate: "2023-12-10T00:00:00.000Z", guestCount: 2, status: CONFIRMED, totalPrice: 2000 }) {
              id
              status
            }
          }
        `,
            });

        bookingId = response.body.data.createBooking.id;
        expect(response.body.data.createBooking.status).toBe('CONFIRMED');
    });

    it('should update a booking', async () => {
        const response = await request(app)
            .post('/graphql')
            .set('authorization', `Bearer ${token}`)
            .send({
                query: `
          mutation {
            updateBooking(id: "${bookingId}", input: { status: CANCELLED }) {
              id
              status
            }
          }
        `,
            });

        expect(response.body.data.updateBooking.status).toBe('CANCELLED');
    });

    it('should fetch a booking by ID', async () => {
        const response = await request(app)
            .post('/graphql')
            .send({
                query: `
          query {
            booking(id: "${bookingId}") {
              id
              status
            }
          }
        `,
            });

        expect(response.body.data.booking.id).toBe(bookingId);
    });

    it('should fetch bookings by user ID', async () => {
        const response = await request(app)
            .post('/graphql')
            .send({
                query: `
          query {
            bookings(userId: "${userId}") {
              id
              status
            }
          }
        `,
            });

        expect(response.body.data.bookings).toBeInstanceOf(Array);
    });
});