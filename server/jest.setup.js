import mongoose from 'mongoose';

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});
