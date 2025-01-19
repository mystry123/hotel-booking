import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation Signup($input: CreateUserInput!) {
    signup(input: $input) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`;