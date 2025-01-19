import { GraphQLError } from 'graphql';
import Hotel from '../models/Hotel.js';
import User from '../models/User.js';
import Room from '../models/Room.js';
import Booking from '../models/Booking.js';

const hotelResolvers = {
    Query: {
        hotel: async (_, { id }) => {
            return Hotel.findById(id).populate('userId');
        },
        hotels: async () => {
            return Hotel.find().populate('userId');
        },
    },
    Mutation: {
        createHotel: async (_, { input }, { user }) => {
            if (!user) throw new GraphQLError('Not authenticated');
             console.log('user', user);
            if (user.role !== 'admin') throw new GraphQLError('Not authorized');
            input.userId = user.id;
            const hotel = new Hotel(input);
            return hotel.save();
        },
        updateHotel: async (_, { id, input }, { user }) => {
            if (!user) throw new GraphQLError('Not authenticated');
            if (user.role !== 'admin') throw new GraphQLError('Not authorized');
            return Hotel.findByIdAndUpdate(id, input, { new: true });
        },
        deleteHotel: async (_, { id }, { user }) => {
            if (!user) throw new GraphQLError('Not authenticated');
            if (user.role !== 'admin') throw new GraphQLError('Not authorized');
            return Hotel.findByIdAndDelete(id);
        },
    },
    Hotel: {
        user: async (parent) => {
            return User.findById(parent.userId);
        },
        rooms: async (parent) => {
            return Room.find({ hotelId: parent.id });
        },
        bookings: async (parent) => {

            const rooms = await Room.find({ hotelId: parent.id });
            const roomIds = rooms.map(room => room.id);
            return Booking.find({ roomId: { $in: roomIds } });

        },
    },
};

export default hotelResolvers;