import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import connectDB from './lib/db.js';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { loadFilesSync } from '@graphql-tools/load-files';
import { authenticate } from './middleware/auth.js';
import path from 'path';
import { fileURLToPath } from 'url';
import resolvers from './resolvers/index.js';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

const port = process.env.PORT || 4000;

try {
    const typeDefs = loadFilesSync(path.join(__dirname, './schema/schema.graphql'));

    const schema = makeExecutableSchema({
        typeDefs,
        resolvers,
    });

    const server = new ApolloServer({
        schema,
        formatError: (error) => {
            console.error('GraphQL Error:', error);
            return error;
        },
    });

    await server.start();

    app.use(cors());
    app.use(bodyParser.json());
    app.use(authenticate);

    app.use('/graphql', expressMiddleware(server, {
        context: async ({ req }) => {
            return {
                user: req.user
            };
        }
    }));

    await connectDB();

    if (process.env.NODE_ENV !== 'test') {
        app.listen({ port: port }, () => {
            console.log('Server is running on http://localhost:4000/graphql');
        });
    }
} catch (error) {
    console.error('Server initialization error:', error);
}