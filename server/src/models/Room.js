import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    roomType: { type: String, required: true },
    price: { type: Number, required: true },
    features: { type: [String] },
    isAvailable: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Room = mongoose.model('Room', roomSchema);

export default Room;