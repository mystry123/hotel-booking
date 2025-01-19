import {gql} from "@apollo/client";

export const UPDATE_BOOKING_STATUS = gql`
    mutation UpdateBookingStatus($id: ID!, $input: CreateBookingInput!) {
        updateBooking(id: $id, input: $input) {
            id
            status
        }
    }
`;



export const CREATE_BOOKING = gql`
    mutation CreateBooking($input: CreateBookingInput!) {
        createBooking(input: $input) {
            id
            startDate
            endDate
            guestCount
            totalPrice
            status
            specialRequests
            roomId
        }
    }
`;