import { GraphQLError } from 'graphql';
import Room from '../models/Room.js';
import Hotel from '../models/Hotel.js';

/**
 * Resolvers for Room-related GraphQL operations.
 */
const roomResolvers = {
    Query: {
        /**
         * Fetches all rooms.
         * @returns {Promise<Array>} A promise that resolves to an array of rooms.
         */
        rooms: async () => {
            return Room.find();
        },
        /**
         * Fetches a room by its ID.
         * @param {Object} _ - Unused parameter.
         * @param {Object} args - The arguments object.
         * @param {string} args.id - The ID of the room to fetch.
         * @returns {Promise<Object>} A promise that resolves to the room object.
         */
        room: async (_, { id }) => {
            return Room.findById(id);
        },
    },
    Mutation: {
        /**
         * Creates a new room.
         * @param {Object} _ - Unused parameter.
         * @param {Object} args - The arguments object.
         * @param {Object} args.input - The input data for the new room.
         * @param {Object} context - The context object.
         * @param {Object} context.user - The user performing the operation.
         * @throws {GraphQLError} If the user is not authenticated or authorized.
         * @returns {Promise<Object>} A promise that resolves to the created room object.
         */
        createRoom: async (_, { input }, { user }) => {
            if (!user) throw new GraphQLError('Not authenticated');
            if (user.role !== 'admin') throw new GraphQLError('Not authorized');
            try {
                const room = new Room(input);
                const savedRoom = await room.save();
                if (!savedRoom) {
                    throw new GraphQLError('Failed to create room');
                }
                return savedRoom;
            } catch (error) {
                console.error('Error creating room:', error);
                throw new GraphQLError('Internal server error');
            }
        },
        /**
         * Updates an existing room.
         * @param {Object} _ - Unused parameter.
         * @param {Object} args - The arguments object.
         * @param {string} args.id - The ID of the room to update.
         * @param {Object} args.input - The input data for updating the room.
         * @param {Object} context - The context object.
         * @param {Object} context.user - The user performing the operation.
         * @throws {GraphQLError} If the user is not authenticated or authorized.
         * @returns {Promise<Object>} A promise that resolves to the updated room object.
         */
        updateRoom: async (_, { id, input }, { user }) => {
            if (!user) throw new GraphQLError('Not authenticated');
            if (user.role !== 'admin') throw new GraphQLError('Not authorized');
            return Room.findByIdAndUpdate(id, input, { new: true });
        },
    },
    Room: {
        /**
         * Fetches the hotel associated with a room.
         * @param {Object} parent - The parent room object.
         * @returns {Promise<Object>} A promise that resolves to the hotel object.
         */
        hotel: async (parent) => {
            return Hotel.findById(parent.hotelId);
        },
    },
};

export default roomResolvers;