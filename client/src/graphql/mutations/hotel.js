import {gql} from "@apollo/client";


export const CREATE_HOTEL_MUTATION = gql`
    mutation CreateHotel($input: CreateHotelInput!) {
        createHotel(input: $input) {
            id
            name
            description
            price
            amenities
            images
            address
            phoneNumber
        }
    }
`;

export const UPDATE_HOTEL_MUTATION = gql`
    mutation UpdateHotel($id: ID!, $input: UpdateHotelInput!) {
        updateHotel(id: $id, input: $input) {
            id
            name
            description
            price
            amenities
            images
            address
            phoneNumber
        }
    }
`;

export const DELETE_HOTEL_MUTATION = gql`
    mutation DeleteHotel($id: ID!) {
        deleteHotel(id: $id) {
            id
        }
    }
`;