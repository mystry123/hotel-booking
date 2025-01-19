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
    /**
     * Load GraphQL type definitions from schema files.
     */
    const typeDefs = loadFilesSync(path.join(__dirname, './schema/schema.graphql'));

    /**
     * Create an executable GraphQL schema.
     */
    const schema = makeExecutableSchema({
        typeDefs,
        resolvers,
    });

    /**
     * Initialize Apollo Server with the created schema.
     */
    const server = new ApolloServer({
        schema,
        formatError: (error) => {
            console.error('GraphQL Error:', error);
            return error;
        },
    });

    await server.start();

    /**
     * Middleware setup.
     */
    app.use(cors());
    app.use(bodyParser.json());
    app.use(authenticate);

    /**
     * Set up the /graphql endpoint with Apollo Server middleware.
     */
    app.use('/graphql', expressMiddleware(server, {
        context: async ({ req }) => {
            return {
                user: req.user
            };
        }
    }));

    /**
     * Connect to the database.
     */
    await connectDB();

    /**
     * Start the server if not running in test mode.
     */

    if (process.env.NODE_ENV !== 'test') {
        app.listen({ port: port }, () => {
            console.log('Server is running on http://localhost:4000/graphql');
        });
    }
} catch (error) {
    console.error('Server initialization error:', error);
}