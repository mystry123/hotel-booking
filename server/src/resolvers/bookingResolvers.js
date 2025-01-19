import { GraphQLError } from 'graphql';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Hotel from '../models/Hotel.js';
import Room from '../models/Room.js';

/**
 * Resolvers for booking-related GraphQL operations.
 */
const bookingResolvers = {
    Query: {
        /**
         * Fetch a booking by its ID.
         * @param {Object} _ - Unused parameter.
         * @param {Object} args - Arguments object.
         * @param {string} args.id - ID of the booking.
         * @returns {Promise<Object>} The booking object.
         */
        booking: async (_, { id }) => {
            return Booking.findById(id);
        },
        /**
         * Fetch all bookings for a specific user.
         * @param {Object} _ - Unused parameter.
         * @param {Object} args - Arguments object.
         * @param {string} args.userId - ID of the user.
         * @returns {Promise<Array>} List of bookings.
         */
        bookings: async (_, { userId }) => {
            return Booking.find({ userId });
        },
    },
    Mutation: {
        /**
         * Create a new booking.
         * @param {Object} _ - Unused parameter.
         * @param {Object} args - Arguments object.
         * @param {Object} args.input - Input data for the booking.
         * @param {Object} context - Context object.
         * @param {Object} context.user - Authenticated user.
         * @returns {Promise<Object>} The created booking object.
         * @throws {GraphQLError} If the user is not authenticated.
         */
        createBooking: async (_, { input }, { user }) => {
            if (!user) throw new GraphQLError('Not authenticated');
            const booking = new Booking({ ...input, userId: user.id });
            return booking.save();
        },
        /**
         * Update an existing booking.
         * @param {Object} _ - Unused parameter.
         * @param {Object} args - Arguments object.
         * @param {string} args.id - ID of the booking.
         * @param {Object} args.input - Updated data for the booking.
         * @param {Object} context - Context object.
         * @param {Object} context.user - Authenticated user.
         * @returns {Promise<Object>} The updated booking object.
         * @throws {GraphQLError} If the user is not authenticated.
         */
        updateBooking: async (_, { id, input }, { user }) => {
            if (!user) throw new GraphQLError('Not authenticated');
            return Booking.findByIdAndUpdate(id, input, { new: true });
        },
    },
    Booking: {
        /**
         * Get the status of the booking.
         * @param {Object} parent - Parent object.
         * @returns {string} The status of the booking.
         */
        status: (parent) => parent.status,
        /**
         * Get the user who made the booking.
         * @param {Object} parent - Parent object.
         * @returns {Promise<Object>} The user object.
         * @throws {GraphQLError} If the user is not found.
         */
        user: async (parent) => {
            const user = await User.findById(parent.userId);
            if (!user) throw new GraphQLError('User not found');
            return user;
        },
        /**
         * Get the room associated with the booking.
         * @param {Object} parent - Parent object.
         * @returns {Promise<Object>} The room object.
         */
        room: async (parent) => {
            return Room.findById(parent.roomId);
        },
        /**
         * Get the hotel associated with the booking.
         * @param {Object} parent - Parent object.
         * @returns {Promise<Object>} The hotel object.
         */
        hotel: async (parent) => {
            const room = await Room.findById(parent.roomId);
            return Hotel.findById(room.hotelId);
        },
    }
};

export default bookingResolvers;