import {gql} from "@apollo/client";

export const  MY_BOOKINGS_QUERY = gql`
    query MyBookings {
        me {
            bookings {
                id
                startDate
                endDate
                status
                guestCount
                room {
                    id
                    roomType
                    price
                    features
                }
                hotel {
                    id
                    name
                    address
                    images
                    amenities
                }
            }
        }
    }
`;