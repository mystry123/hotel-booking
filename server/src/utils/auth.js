const { GraphQLError } = require('graphql');
const { ZodError } = require('zod');
const { createUserSchema, loginSchema } = require('../validation/schemas');
const { generateSalt, hashPassword, comparePasswords, generateToken, verifyToken } = require('../utils/auth');

const userResolvers = {
    Query: {
        me: async (_, __, { prisma, user }) => {
            if (!user) throw new GraphQLError('Not authenticated');
            return prisma.user.findUnique({ where: { id: user.id } });
        },
    },
    Mutation: {
        signup: async (_, { input }, { prisma }) => {
            try {
                createUserSchema.parse(input);
            } catch (e) {
                if (e instanceof ZodError) {
                    throw new GraphQLError('Invalid input', { extensions: { code: 'BAD_USER_INPUT', errors: e.errors } });
                }
                throw e;
            }

            const salt = generateSalt();
            const hashedPassword = await hashPassword(input.password, salt);

            const user = await prisma.user.create({
                data: {
                    email: input.email,
                    password: hashedPassword,
                    salt,
                    name: input.name,
                },
            });

            const token = generateToken(user);

            return { token, user };
        },
        login: async (_, { input }, { prisma }) => {
            try {
                loginSchema.parse(input);
            } catch (e) {
                if (e instanceof ZodError) {
                    throw new GraphQLError('Invalid input', { extensions: { code: 'BAD_USER_INPUT', errors: e.errors } });
                }
                throw e;
            }

            const user = await prisma.user.findUnique({ where: { email: input.email } });
            if (!user || !(await comparePasswords(input.password, user.password, user.salt))) {
                throw new GraphQLError('Invalid credentials');
            }

            const token = generateToken(user);

            return { token, user };
        },
    },
};

module.exports = userResolvers;