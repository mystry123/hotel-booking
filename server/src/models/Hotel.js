import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
    amenities: { type: [String] },
    images: { type: [String] },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    address: { type: String },
    phoneNumber: { type: String },
    totalRooms: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;