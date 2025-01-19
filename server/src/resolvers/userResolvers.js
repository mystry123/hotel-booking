import { GraphQLError } from 'graphql';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ZodError } from 'zod';
import { createUserSchema, loginSchema } from '../validation/schemas.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';

const userResolvers = {
    Query: {
        me: async (_, __, { user }) => {
            if (!user) throw new GraphQLError('Not authenticated');
            return User.findById(user.id);
        },
        user: async (_, { id }) => {
            return User.findById(id);
        },
    },
    Mutation: {
        signup: async (_, { input }) => {
            try {
                createUserSchema.parse(input);
                const salt = bcrypt.genSaltSync(10)

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
        bookings: async (parent) => {
            return Booking.find({ userId: parent.id });
        },
    },
};

export default userResolvers;