import { GraphQLError } from 'graphql';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Hotel from '../models/Hotel.js';
import Room from '../models/Room.js';

const bookingResolvers = {
    Query: {
        booking: async (_, { id }) => {
            return Booking.findById(id);
        },
        bookings: async (_, { userId }) => {
            return Booking.find({ userId });
        },
    },
    Mutation: {
        createBooking: async (_, { input }, { user }) => {
            if (!user) throw new GraphQLError('Not authenticated');
            const booking = new Booking({ ...input, userId: user.id });
            return booking.save();
        },
        updateBooking: async (_, { id, input }, { user }) => {
            if (!user) throw new GraphQLError('Not authenticated');
            return Booking.findByIdAndUpdate(id, input, { new: true });
        },
    },
    Booking: {
        status: (parent) => parent.status,
        user: async (parent) => {
            const user = await User.findById(parent.userId);
            if (!user) throw new GraphQLError('User not found');
            return user;
        },
        room: async (parent) => {
            return Room.findById(parent.roomId);
        },
        hotel: async (parent) => {
            const room = await Room.findById(parent.roomId);
            return Hotel.findById(room.hotelId);
        },
    }
};

export default bookingResolvers;