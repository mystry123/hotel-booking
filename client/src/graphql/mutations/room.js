import {gql} from "@apollo/client";

export const CREATE_ROOM_MUTATION = gql`
    mutation CreateRoom($input: CreateRoomInput!) {
        createRoom(input: $input) {
            id
            hotelId
            roomType
            price
            features
        }
    }
`;

export const UPDATE_ROOM_MUTATION = gql`
    mutation UpdateRoom($id: ID!, $input: UpdateRoomInput!) {
        updateRoom(id: $id, input: $input) {
            id
            hotelId
            roomType
            price
            features
        }
    }
`;