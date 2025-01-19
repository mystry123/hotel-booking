import { GraphQLError } from 'graphql';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ZodError } from 'zod';
import { createUserSchema, loginSchema } from '../validation/schemas.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';

/**
 * Resolvers for User-related GraphQL operations.
 */
const userResolvers = {
    Query: {
        /**
         * Fetches the authenticated user's details.
         * @param {Object} _ - Unused parameter.
         * @param {Object} __ - Unused parameter.
         * @param {Object} context - The context object.
         * @param {Object} context.user - The authenticated user.
         * @throws {GraphQLError} If the user is not authenticated.
         * @returns {Promise<Object>} A promise that resolves to the user object.
         */
        me: async (_, __, { user }) => {
            if (!user) throw new GraphQLError('Not authenticated');
            return User.findById(user.id);
        },
        /**
         * Fetches a user by their ID.
         * @param {Object} _ - Unused parameter.
         * @param {Object} args - The arguments object.
         * @param {string} args.id - The ID of the user to fetch.
         * @returns {Promise<Object>} A promise that resolves to the user object.
         */
        user: async (_, { id }) => {
            return User.findById(id);
        },
        /**
         * Fetches all users.
         * @returns {Promise<Array>} A promise that resolves to an array of users.
         */
        users: async () => {
            return User.find();
        }
    },
    Mutation: {
        /**
         * Signs up a new user.
         * @param {Object} _ - Unused parameter.
         * @param {Object} args - The arguments object.
         * @param {Object} args.input - The input data for the new user.
         * @throws {GraphQLError} If the user already exists or input is invalid.
         * @returns {Promise<Object>} A promise that resolves to an object containing the token and user.
         */
        signup: async (_, { input }) => {
            try {
                createUserSchema.parse(input);
                const salt = bcrypt.genSaltSync(10);

                // check for existing user
                const existingUser = await User.findOne({ email: input.email });
                if (existingUser) {
                    throw new GraphQLError('User already exists');
                }

                const hashedPassword = bcrypt.hashSync(input.password, salt);
                const user = new User({
                    email: input.email,
                    password: hashedPassword,
                    name: input.name,
                    role: input.role,
                });
                await user.save();

                const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

                return { token, user };
            } catch (e) {
                if (e instanceof ZodError) {
                    throw new GraphQLError('Invalid input', { extensions: { code: 'BAD_USER_INPUT', errors: e.errors } });
                }
                throw e;
            }
        },
        /**
         * Logs in an existing user.
         * @param {Object} _ - Unused parameter.
         * @param {Object} args - The arguments object.
         * @param {Object} args.input - The input data for login.
         * @throws {GraphQLError} If the credentials are invalid or input is invalid.
         * @returns {Promise<Object>} A promise that resolves to an object containing the token and user.
         */
        login: async (_, { input }) => {
            try {
                loginSchema.parse(input);
            } catch (e) {
                if (e instanceof ZodError) {
                    throw new GraphQLError('Invalid input', { extensions: { code: 'BAD_USER_INPUT', errors: e.errors } });
                }
                throw e;
            }

            const user = await User.findOne({ email: input.email });
            if (!user || !bcrypt.compareSync(input.password, user.password)) {
                throw new GraphQLError('Invalid credentials');
            }

            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

            return { token, user };
        },
    },
    User: {
        /**
         * Fetches the bookings associated with a user.
         * @param {Object} parent - The parent user object.
         * @returns {Promise<Array>} A promise that resolves to an array of bookings.
         */
        bookings: async (parent) => {
            return Booking.find({ userId: parent.id });
        },
    },
};

export default userResolvers;