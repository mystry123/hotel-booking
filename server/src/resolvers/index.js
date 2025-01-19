// server/src/resolvers/index.js
import userResolvers from './userResolvers.js';
import hotelResolvers from './hotelResolvers.js';
import bookingResolvers from './bookingResolvers.js';
import roomResolvers from './roomResolvers.js';
import { GraphQLScalarType, Kind } from 'graphql';

const resolvers = {
    Query: {
        ...userResolvers.Query,
        ...hotelResolvers.Query,
        ...bookingResolvers.Query,
        ...roomResolvers.Query,
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...hotelResolvers.Mutation,
        ...bookingResolvers.Mutation,
        ...roomResolvers.Mutation,
    },
    User: {
        ...userResolvers.User,
    },
    Hotel: {
        ...hotelResolvers.Hotel,
    },
    Booking: {
        ...bookingResolvers.Booking,
    },
    Room: {
        ...roomResolvers.Room,
    },
    AuthPayload: {
        token: (parent) => parent.token,
        user: (parent) => parent.user,
    },
    DateTime: new GraphQLScalarType({
        name: 'DateTime',
        description: 'DateTime custom scalar type',
        serialize(value) {
            return value.toISOString();
        },
        parseValue(value) {
            return new Date(value);
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.STRING) {
                return new Date(ast.value);
            }
            return null;
        },
    }),
    EmailAddress: new GraphQLScalarType({
        name: 'EmailAddress',
        description: 'Email address scalar type',
        serialize(value) {
            return value;
        },
        parseValue(value) {
            // Add email validation logic if needed
            return value;
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.STRING) {
                return ast.value;
            }
            return null;
        },
    }),
};

export default resolvers;