// server/src/resolvers/roomResolvers.js
import { GraphQLError } from 'graphql';
import Room from '../models/Room.js';
import Hotel from '../models/Hotel.js';

const roomResolvers = {
    Query: {
        rooms: async () => {
            return Room.find();
        },
        room: async (_, { id }) => {
            return Room.findById(id);
        },
    },
    Mutation: {
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
        updateRoom: async (_, { id, input }, { user }) => {
            if (!user) throw new GraphQLError('Not authenticated');
            if (user.role !== 'admin') throw new GraphQLError('Not authorized');
            return Room.findByIdAndUpdate(id, input, { new: true });
        },
    },
    Room: {
        hotel: async (parent) => {
            return Hotel.findById(parent.hotelId);
        },
    },
};

export default roomResolvers;