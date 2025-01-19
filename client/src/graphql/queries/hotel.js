import {gql} from "@apollo/client";

export const HOTELS_QUERY = gql`
    query Hotels {
        hotels {
            id
            name
            address
            amenities
            bookings {
                guestCount
            }
            description
            images
            user {
                id
            }
        }
    }
`;

export const GET_HOTEL_QUERY_FOR_ADMIN = gql`
    query GetHotel($id: ID!) {
        hotel(id: $id) {
            id
            name
            description
            price
            amenities
            images
            address
            phoneNumber
            rooms {
                id
                roomType
                price
                features
            }
        }
    }
`;

export const GET_HOTEL_DETAILS = gql`
    query GetHotelDetails($id: ID!) {
        hotel(id: $id) {
            id
            name
            description
            price
            amenities
            images
            totalRooms
            address
            phoneNumber
            rooms {
                id
                roomType
                price
                features
            }
            bookings {
                id
                startDate
                status
                endDate
                guestCount
                user {
                    id
                    name
                }
            }
        }
    }
`;