import { GraphQLError } from 'graphql';
import Hotel from '../models/Hotel.js';
import User from '../models/User.js';
import Room from '../models/Room.js';
import Booking from '../models/Booking.js';

/**
 * Resolvers for hotel-related GraphQL queries and mutations.
 */
const hotelResolvers = {
    /**
     * Query resolvers.
     */
    Query: {
        /**
         * Fetch a hotel by its ID.
         * @param {Object} _ - Unused parent argument.
         * @param {Object} args - Arguments for the query.
         * @param {string} args.id - The ID of the hotel.
         * @returns {Promise<Object>} The hotel object.
         */
        hotel: async (_, { id }) => {
            return Hotel.findById(id).populate('userId');
        },
        /**
         * Fetch all hotels.
         * @returns {Promise<Array>} List of hotel objects.
         */
        hotels: async () => {
            return Hotel.find().populate('userId');
        },
    },
    /**
     * Mutation resolvers.
     */
    Mutation: {
        /**
         * Create a new hotel.
         * @param {Object} _ - Unused parent argument.
         * @param {Object} args - Arguments for the mutation.
         * @param {Object} args.input - Input data for the new hotel.
         * @param {Object} context - Context object containing the authenticated user.
         * @param {Object} context.user - The authenticated user.
         * @returns {Promise<Object>} The created hotel object.
         * @throws {GraphQLError} If the user is not authenticated or not authorized.
         */
        createHotel: async (_, { input }, { user }) => {
            if (!user) throw new GraphQLError('Not authenticated');
            console.log('user', user);
            if (user.role !== 'admin') throw new GraphQLError('Not authorized');
            input.userId = user.id;
            const hotel = new Hotel(input);
            return hotel.save();
        },
        /**
         * Update an existing hotel.
         * @param {Object} _ - Unused parent argument.
         * @param {Object} args - Arguments for the mutation.
         * @param {string} args.id - The ID of the hotel to update.
         * @param {Object} args.input - Input data for updating the hotel.
         * @param {Object} context - Context object containing the authenticated user.
         * @param {Object} context.user - The authenticated user.
         * @returns {Promise<Object>} The updated hotel object.
         * @throws {GraphQLError} If the user is not authenticated or not authorized.
         */
        updateHotel: async (_, { id, input }, { user }) => {
            if (!user) throw new GraphQLError('Not authenticated');
            if (user.role !== 'admin') throw new GraphQLError('Not authorized');
            return Hotel.findByIdAndUpdate(id, input, { new: true });
        },
        /**
         * Delete an existing hotel.
         * @param {Object} _ - Unused parent argument.
         * @param {Object} args - Arguments for the mutation.
         * @param {string} args.id - The ID of the hotel to delete.
         * @param {Object} context - Context object containing the authenticated user.
         * @param {Object} context.user - The authenticated user.
         * @returns {Promise<Object>} The deleted hotel object.
         * @throws {GraphQLError} If the user is not authenticated or not authorized.
         */
        deleteHotel: async (_, { id }, { user }) => {
            if (!user) throw new GraphQLError('Not authenticated');
            if (user.role !== 'admin') throw new GraphQLError('Not authorized');
            return Hotel.findByIdAndDelete(id);
        },
    },
    /**
     * Field resolvers for the Hotel type.
     */
    Hotel: {
        /**
         * Resolve the user field of a hotel.
         * @param {Object} parent - The hotel object.
         * @returns {Promise<Object>} The user object.
         */
        user: async (parent) => {
            return User.findById(parent.userId);
        },
        /**
         * Resolve the rooms field of a hotel.
         * @param {Object} parent - The hotel object.
         * @returns {Promise<Array>} List of room objects.
         */
        rooms: async (parent) => {
            return Room.find({ hotelId: parent.id });
        },
        /**
         * Resolve the bookings field of a hotel.
         * @param {Object} parent - The hotel object.
         * @returns {Promise<Array>} List of booking objects.
         */
        bookings: async (parent) => {
            const rooms = await Room.find({ hotelId: parent.id });
            const roomIds = rooms.map(room => room.id);
            return Booking.find({ roomId: { $in: roomIds } });
        },
    },
};

export default hotelResolvers;