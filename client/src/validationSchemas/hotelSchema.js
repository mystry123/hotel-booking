// client/src/validationSchemas/hotelSchema.js
import * as Yup from 'yup';

const HotelSchema = Yup.object().shape({
    name: Yup.string().required('Hotel name is required'),
    description: Yup.string(),
    price: Yup.number()
        .required('Base price is required')
        .positive('Price must be positive'),
    availableRooms: Yup.number()
        .required('Number of rooms is required')
        .integer('Must be a whole number')
        .min(1, 'Must have at least one room'),
    amenities: Yup.array().of(Yup.string()),
    images: Yup.array().of(Yup.string()),
    address: Yup.string().required('Address is required'),
    phoneNumber: Yup.string()
        .matches(/^\+?[\d\s-]+$/, 'Invalid phone number')
        .required('Phone number is required'),
    rooms: Yup.array().of(
        Yup.object().shape({
            roomType: Yup.string().required('Room type is required'),
            price: Yup.number()
                .required('Room price is required')
                .positive('Price must be positive'),
            features: Yup.array().of(Yup.string())
        })
    )
});

export default HotelSchema;
