import mongoose from 'mongoose';


const connectDB = async () => {
    const MONGO_URI = process.env?.NODE_ENV === 'test' ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected successfully at');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

export default connectDB;